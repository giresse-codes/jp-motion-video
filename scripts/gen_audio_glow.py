"""Pub « JP Glow » : musique cinématique douce + bip, frappe, whoosh feutré, nappe grave (remplaçants synthétiques)."""
import numpy as np, wave
SR=44100; rng=np.random.default_rng(11)
def save(p,x):
    x=np.clip(x,-1,1)
    if x.ndim==1: x=np.stack([x,x],1)
    w=wave.open(p,'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((x*32767).astype(np.int16).tobytes());w.close()
def lp(x,a):
    y=np.empty_like(x);acc=0.0
    for i in range(len(x)): acc+=a*(x[i]-acc);y[i]=acc
    return y
m2f=lambda m:440*2**((m-69)/12)
# bip doux
n=int(.35*SR);t=np.arange(n)/SR
bip=(np.sin(2*np.pi*1046*t)*.6+np.sin(2*np.pi*1568*t)*.25)*np.minimum(1,t/.008)*np.exp(-t*12)
save('public/sfx-glow/bip.wav',bip*.5)
# frappe clavier légère
n=int(.05*SR);t=np.arange(n)/SR
k=rng.standard_normal(n)*np.exp(-t*260); k=k-lp(k,.15); k+=np.sin(2*np.pi*3200*t)*np.exp(-t*400)*.3
save('public/sfx-glow/key.wav',k/np.abs(k).max()*.35)
# whoosh feutré (bruit très filtré)
n=int(.9*SR);t=np.arange(n)/SR;no=rng.standard_normal(n)
env=np.sin(np.pi*t/.9)**3
y=np.empty(n);a1=a2=0
cut=.01+.06*np.sin(np.pi*t/.9)
for i in range(n): a1+=cut[i]*(no[i]-a1);a2+=cut[i]*(a1-a2);y[i]=a2
y=y/np.abs(y).max()*env*.6;pan=np.linspace(-.5,.5,n)
save('public/sfx-glow/whoosh.wav',np.stack([y*(1-pan),y*(1+pan)],1)*.8)
# nappe grave (logo)
n=int(3.2*SR);t=np.arange(n)/SR
env=np.minimum(1,t/.25)*np.exp(-np.maximum(0,t-.4)*1.1)
d=sum(np.sin(2*np.pi*f*t+ph)*g for f,g,ph in [(41.2,.6,0),(61.7,.35,1),(82.4,.25,2),(123.5,.08,.5)])
d+=lp(rng.standard_normal(n),.01)*1.5
save('public/sfx-glow/drone.wav',d/np.abs(d).max()*env*.8)
# musique : pad chaud + notes de piano éparses, 11.5 s
D=11.5;N=int(D*SR);t=np.arange(N)/SR;mus=np.zeros(N)
prog=[(0,[45,52,57,60,64]),(3.0,[41,48,53,57,64]),(6.0,[43,50,55,59,62]),(8.0,[45,52,57,61,64])]
for k,(st,ch) in enumerate(prog):
    en=prog[k+1][0] if k+1<len(prog) else D
    s0,s1=int(st*SR),min(N,int((en+1.2)*SR));tt=np.arange(s1-s0)/SR;L=(s1-s0)/SR
    env=np.minimum(1,tt/1.0)*np.minimum(1,np.maximum(0,(L-tt)/1.2))
    for m in ch:
        f=m2f(m);v=.035
        mus[s0:s1]+=v*env*(np.sin(2*np.pi*f*tt)+.5*np.sin(2*np.pi*f*1.003*tt+1)+.2*np.sin(2*np.pi*f*2*tt))
for st,m in [(0.3,76),(1.6,72),(3.0,74),(4.2,69),(5.4,72),(6.0,71),(7.7,76),(8.4,73),(9.6,69)]:
    s0=int(st*SR);L=min(int(2.5*SR),N-s0);tt=np.arange(L)/SR;f=m2f(m)
    mus[s0:s0+L]+=.07*(np.sin(2*np.pi*f*tt)+.3*np.sin(2*np.pi*2*f*tt))*np.exp(-tt*2.2)*np.minimum(1,tt/.005)
mus=lp(mus,.25)
mus+=lp(rng.standard_normal(N),.004)*.4  # souffle grave
mus*=np.minimum(1,np.minimum(t/.6,(D-t)/1.0).clip(0))
save('public/musique-glow.wav',mus/np.abs(mus).max()*.8)
print('ok')
