import { Link } from '@tanstack/react-router'

export default function Header() {
    return (
        <header className="flex items-center bg-gray-800 p-4 text-white shadow-lg">
            <h1 className="ml-4 text-xl font-semibold">
                <Link to="/">Craft Battle</Link>
            </h1>
        </header>
    )
}
