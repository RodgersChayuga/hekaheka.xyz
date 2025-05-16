import { useZustandStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function EditComic() {
    const { wallet, comicPages } = useZustandStore();
    const router = useRouter();

    if (!wallet) {
        router.push('/');
        return null;
    }

    if (!comicPages.length) {
        return (
            <div className="text-center p-8">
                <p>No comic generated yet</p>
                <button
                    onClick={() => router.push('/story-input')}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Create New Comic
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Your Comic</h1>

            <div className="grid gap-6">
                {comicPages.map((page, index) => (
                    <div key={index} className="border rounded-lg p-4">
                        <h2 className="text-xl font-semibold">Page {index + 1}</h2>
                        <p className="my-2">{page.text}</p>
                        <img
                            src={page.imageUrl}
                            alt={`Page ${index + 1}`}
                            className="w-full h-auto mt-2 rounded"
                        />
                        {page.userImageHash && (
                            <div className="mt-4">
                                <p className="text-sm">Original Upload:</p>
                                <img
                                    src={`https://ipfs.io/ipfs/${page.userImageHash}`}
                                    alt="Original character"
                                    className="w-32 h-auto mt-1 rounded"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-8">
                <button
                    onClick={() => router.push('/image-upload')}
                    className="px-4 py-2 border rounded"
                >
                    Back
                </button>
                <button
                    onClick={() => router.push('/mint')}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Mint as NFT
                </button>
            </div>
        </div>
    );
}