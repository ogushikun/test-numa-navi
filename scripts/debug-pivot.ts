
import { rankPivotWorksAction } from '../app/actions';
import { Work } from '../types';

const mockAnchor: Work = {
    id: 'test-1',
    title: 'Neon Genesis Evangelion',
    media: 'anime',
    rating: 'R15',
    description: 'A psychological mecha anime.',
    thumbnailUrl: '',
    links: [],
    tags: { depth: 2, intensity: 2, direction: 'story', aftertaste: 'dark', filter: 'neutral' },
    reason: '',
    genres: ['Mecha', 'Psychological'],
    weighted_genres: [{ name: 'Mecha', value: 90 }]
};

const mockCandidates: Work[] = [
    {
        id: 'test-2',
        title: 'RahXephon',
        media: 'anime',
        rating: 'G',
        description: 'Mecha with music themes.',
        thumbnailUrl: '',
        links: [],
        tags: { depth: 1, intensity: 1, direction: 'story', aftertaste: 'lingering', filter: 'neutral' },
        reason: '',
        genres: ['Mecha', 'Music'],
        weighted_genres: [{ name: 'Mecha', value: 80 }]
    }
];

async function runDebug() {
    console.log('Testing rankPivotWorksAction with "buddy" persona...');
    const result = await rankPivotWorksAction(mockAnchor, mockCandidates, 'buddy');
    console.log('Result Tone Check:', result.rankedWorks[0].aiReason);
}

runDebug();
