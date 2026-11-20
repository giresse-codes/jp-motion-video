"""Pub « JP Pop » : beat pop énergique 120 bpm + pop, whoosh, clic, fusée, tick (remplaçants synthétiques)."""
import numpy as np, wave
SR=44100; rng=np.random.default_rng(5)
def save(p,x):
    x=np.clip(x,-1,1)
    if x.ndim==1: x=np.stack([x,x],1)
    w=wave.open(p,'wb');w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((x*32767).astype(np.int16).tobytes());w.close()
def lp(x,a):
    y=np.empty_like(x);acc=0.0
    for i in range(len(x)): acc+=a*(x[i]-acc);y[i]=acc
    return y
m2f=lambda m:440*2**((m-69)/12)
T=lambda d:np.arange(int(d*SR))/SR
# pop : bulle
t=T(.18);f=np.linspace(500,1100,len(t));pop=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*30)*np.minimum(1,t/.003)
save('public/sfx-pop/pop.wav',pop*.55)
# whoosh (explosion de collage)
t=T(.6);no=rng.standard_normal(len(t));env=np.sin(np.pi*t/.6)**2*np.exp(-t*1.5)
y=np.empty(len(t));a1=a2=0;cut=.03+.3*np.exp(-t*4)
for i in range(len(t)): a1+=cut[i]*(no[i]-a1);a2+=cut[i]*(a1-a2);y[i]=a2
save('public/sfx-pop/whoosh.wav',y/np.abs(y).max()*env*.7)
# clic d'interrupteur
t=T(.08);c=(rng.standard_normal(len(t))*np.exp(-t*500)+np.sin(2*np.pi*1800*t)*np.exp(-t*160)*.6)
t2=T(.08);c2=np.sin(2*np.pi*900*t2)*np.exp(-t2*200)*.5
click=np.concatenate([c,np.zeros(int(.03*SR)),c2])
save('public/sfx-pop/click.wav',click/np.abs(click).max()*.6)
# fusée qui décolle
t=T(1.6);no=rng.standard_normal(len(t));y=np.empty(len(t));acc=0
cut=.02+.25*(t/1.6)
for i in range(len(t)): acc+=cut[i]*(no[i]-acc);y[i]=acc
rum=np.sin(2*np.pi*np.cumsum(np.linspace(60,220,len(t)))/SR)*.4
env=np.minimum(1,t/.15)*np.exp(-np.maximum(0,t-.9)*3)
r=(y/np.abs(y).max()+rum)*env
save('public/sfx-pop/rocket.wav',r/np.abs(r).max()*.6)
# tick rapide
t=T(.03);tk=np.sin(2*np.pi*3000*t)*np.exp(-t*300)
save('public/sfx-pop/tick.wav',tk*.45)
# beat 120 bpm
D=46;N=D*SR;mus=np.zeros(N);bpm=120;b=60/bpm
def add(s,x,g=1):
    s=int(s*SR);L=min(len(x),N-s)
    if L>0: mus[s:s+L]+=x[:L]*g
kt=T(.35);kick=np.sin(2*np.pi*(45+120*np.exp(-kt*28))*kt)*np.exp(-kt*9)
ct=T(.2);clap=rng.standard_normal(len(ct))*np.exp(-ct*25);clap=clap-lp(clap,.2)
ht=T(.05);hat=rng.standard_normal(len(ht))*np.exp(-ht*90);hat=hat-lp(hat,.5)
chords=[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,67]]  # Cmaj7 Am7 Fmaj7 G
bass=[36,33,29,31]
nb=int(D/b)
for i in range(nb):
    s=i*b;bar=i//4;ch=chords[bar%4]
    intro = i<2
    add(s,kick,.9 if not intro else .5)
    if i%2==1: add(s,clap,.35)
    add(s+b/2,hat,.18);add(s+b/4,hat,.07);add(s+3*b/4,hat,.07)
    # basse syncopée
    f=m2f(bass[bar%4]);bt=T(b*.45)
    add(s+b/2,np.sign(np.sin(2*np.pi*f*bt))*.5*np.exp(-bt*6)+np.sin(2*np.pi*f*bt)*np.exp(-bt*4),.18)
    # stabs d'accords sur le contretemps
    if i%2==0:
        st=T(.22);stab=sum(np.sin(2*np.pi*m2f(m)*st)+.4*np.sin(2*np.pi*2*m2f(m)*st) for m in ch)*np.exp(-st*12)
        add(s+b/2,stab,.05)
    # pluck arpège en double-croches
    for j in range(2):
        m=ch[(i*2+j)%4]+12;pt=T(.2)
        add(s+j*b/2,np.sin(2*np.pi*m2f(m)*pt)*np.exp(-pt*16),.045)
t=np.arange(N)/SR
mus*=np.minimum(1,np.minimum(t/.3,(D-t)/1.5).clip(0))
save('public/musique-pop.wav',mus/np.abs(mus).max()*.85)
print('ok')
