import CardSwap, { Card } from '@/components/CardSwap';
import Image from 'next/image';

export default function Welcome() {
  const letters = Array.from('ABCDEFGHIJKLMNÑOPQRSTUVWXYZ');

  const getLetterFile = (letter: string) => {
    const letterMap: { [key: string]: string } = {
      'A': 'A.svg', 'B': 'B.svg', 'C': 'c.svg', 'D': 'd.svg', 'E': 'e.svg', 'F': 'f.svg', 'G': 'g.svg', 'H': 'h.svg', 'I': 'i.svg', 'J': 'j.svg', 'K': 'k.svg', 'L': 'l.svg', 'M': 'm.svg', 'N': 'n.svg', 'Ñ': 'nn.svg', 'O': 'o.svg', 'P': 'p.svg', 'Q': 'q.svg', 'R': 'r.svg', 'S': 's.svg', 'T': 't.svg', 'U': 'u.svg', 'V': 'v.svg', 'W': 'w.svg', 'X': 'x.svg', 'Y': 'y.svg', 'Z': 'z.svg'
    };
    return letterMap[letter];
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a', position: 'relative' }}>
      <div style={{ height: '820px', position: 'relative' }}>
        <CardSwap cardDistance={80} verticalDistance={150} delay={2800} pauseOnHover={false} width={580} height={580}>
          {letters.map((letter, idx) => {
            const svgFile = getLetterFile(letter);
            return (
              <Card key={idx}>
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <div style={{ width: 380, height: 380, borderRadius: 24, background: 'rgba(234, 90, 12, 0)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                    {svgFile ? (
                      <Image src={`/Abecedario/${svgFile}`} alt={`Letra ${letter} en LSM`} width={380} height={380} style={{ width: 360, height: 360, objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: 120, color: '#fff', fontWeight: 800 }}>{letter}</span>
                    )}
                  </div>
                  <span style={{ color: '#fff', fontSize: 32, fontWeight: 900 }}>{letter}</span>
                </div>
              </Card>
            );
          })}
        </CardSwap>
      </div>
    </div>
  );
}
