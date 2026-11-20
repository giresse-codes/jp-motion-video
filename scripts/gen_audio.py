"""Génère la musique minimaliste et les SFX (whoosh, tic) — remplaçants synthétiques."""
import numpy as np, wave, os
SR=44100
def save(p,x):
    x=np.clip(x,-1,1);x=(x*32767).astype(np.int16)
    if x.ndim==1: x=np.stack([x,x],1)
    w=wave.open(p,'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(x.tobytes());w.close()
rng=np.random.default_rng(7)
def lp(x,a):  # one-pole lowpass, a in (0,1)
    y=np.empty_like(x);acc=0.0
    for i,v in enumerate(x): acc+=a*(v-acc);y[i]=acc
    return y
# --- whoosh : bruit filtré avec balayage + enveloppe douce
n=int(0.7*SR);t=np.arange(n)/SR
noise=rng.standard_normal(n)
env=np.sin(np.pi*np.clip(t/0.7,0,1))**2
cut=0.02+0.18*np.sin(np.pi*t/0.7)
y=np.empty(n);acc=0;acc2=0
for i in range(n):
    acc+=cut[i]*(noise[i]-acc);acc2+=cut[i]*(acc-acc2);y[i]=acc2
y=y/np.abs(y).max()*env*0.55
pan=np.linspace(-0.6,0.6,n)
save('public/sfx/whoosh.wav',np.stack([y*(1-pan)/1.6*1.3,y*(1+pan)/1.6*1.3],1))
# --- tic : clic boisé court
n=int(0.12*SR);t=np.arange(n)/SR
tic=(np.sin(2*np.pi*2400*t)*0.6+np.sin(2*np.pi*1300*t)*0.4)*np.exp(-t*90)
tic+=rng.standard_normal(n)*np.exp(-t*600)*0.25
save('public/sfx/tic.wav',tic*0.7)
# --- pop doux (apparition à ressort)
n=int(0.25*SR);t=np.arange(n)/SR
f=np.linspace(380,720,n)
pop=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*22)*0.5
save('public/sfx/pop.wav',pop)
# --- musique : nappes + pluck, 96 bpm, 46 s
D=46;N=D*SR;t=np.arange(N)/SR;mus=np.zeros(N)
bpm=96;beat=60/bpm
chords=[[57,60,64,67],[53,57,60,64],[48,52,55,59],[55,59,62,65]]  # Am7 Fmaj7 Cmaj7 G7
m2f=lambda m:440*2**((m-69)/12)
bar=beat*4
for k in range(int(D/bar)+1):
    ch=chords[k%4];s=int(k*bar*SR);e=min(N,int((k+1)*bar*SR)+int(0.5*SR))
    tt=np.arange(e-s)/SR;env=np.minimum(1,tt/0.8)*np.minimum(1,(e-s)/SR-tt+0.0)/1
    env=np.clip(env,0,1)
    for m in ch:
        f=m2f(m-12)
        mus[s:e]+=0.05*env*(np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*f*2.003*tt))
    # pluck arpège
    for j in range(8):
        ps=s+int(j*beat/2*SR);
        if ps>=N: break
        m=ch[[0,2,1,3,2,0,3,1][j]]+12;f=m2f(m);L=min(int(0.6*SR),N-ps);tt=np.arange(L)/SR
        mus[ps:ps+L]+=0.06*np.sin(2*np.pi*f*tt)*np.exp(-tt*7)*(0.6+0.4*(j%2==0))
# kick doux / hat
for b in range(int(D/beat)):
    ps=int(b*beat*SR);L=min(int(0.25*SR),N-ps);tt=np.arange(L)/SR
    if b%2==0: mus[ps:ps+L]+=0.12*np.sin(2*np.pi*(50+60*np.exp(-tt*30))*tt)*np.exp(-tt*14)
    hs=ps+int(beat/2*SR)
    if hs+2000<N: mus[hs:hs+2000]+=rng.standard_normal(2000)*np.exp(-np.arange(2000)/250)*0.015
fade=np.minimum(1,np.minimum(t/1.5,(D-1-t)/2.5).clip(0))
mus*=fade
mus=mus/np.abs(mus).max()*0.8
save('public/musique.wav',mus)
print('ok')
