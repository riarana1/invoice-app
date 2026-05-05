export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About This App</h1>

      <div className="prose lg:prose-xl">
        <p>
          This is a demonstration of how to implement authentication in Next.js
          15 using NextAuth.js. It shows how to:
        </p>
        <ul>
          <li>Set up Google authentication</li>
          <li>Protect routes using middleware</li>
          <li>Create a user interface that changes based on login status</li>
          <li>Redirect users after login</li>
        </ul>
        <p>
          The app demonstrates both server-side and client-side authentication
          checks, providing a complete authentication solution.
        </p>
        <h2>Technologies Used</h2>
        <ul>
          <li>Next.js 15</li>
          <li>NextAuth.js</li>
          <li>React 19</li>
          <li>Tailwind CSS</li>
        </ul>
      </div>
    </div>
  )
}
