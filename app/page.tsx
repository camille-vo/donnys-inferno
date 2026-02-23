import { Card } from 'pixel-retroui';

export default function Home() {
    return (
        <div style={{ maxWidth: '60rem', width: '100%', margin: '0 auto', padding: '2rem' }}>

            <Card className="p-4 text-center w-full" bg="#ddceb4"
                textColor="#30210b"
                borderColor="#30210b"
                shadowColor="#30210b">
                <h2>Welcome, friend</h2>
            </Card>
        </div>

    )
}