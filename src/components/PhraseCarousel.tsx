import { Card, CardContent } from '@/components/ui/card';
import { Hand } from 'lucide-react';
import { Phrase } from '@/lib/data';

interface PhraseCarouselProps {
  phrases: Phrase[];
}

export default function PhraseCarousel({ phrases }: PhraseCarouselProps) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 pb-1" style={{ width: 'max-content' }}>
        {phrases.map((phrase, index) => (
          <Card 
            key={index}
            className="flex-shrink-0 w-20 bg-orange-700/50 border-orange-600 hover:bg-orange-600/50 transition-colors cursor-pointer group"
          >
            <CardContent className="p-2 flex flex-col items-center gap-1">
              <div className="w-8 h-8 bg-orange-400/20 rounded-full flex items-center justify-center group-hover:bg-orange-400/30 transition-colors">
                <Hand className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-xs text-center text-orange-100 group-hover:text-white transition-colors font-medium leading-tight">
                {phrase.text}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

