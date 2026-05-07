import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight dark:text-white">
              About This App
            </h1>
            <p className="text-muted-foreground">
              Learn more about the features and architecture of this
              application.
            </p>
          </header>

          <Card className="shadow-sm border-none dark:bg-slate-900 dark:border-slate-800">
            <CardContent className="pt-6">
              <div className="prose lg:prose-xl dark:prose-invert text-gray-700 dark:text-slate-300">
                <p>
                  This is a demonstration of how to implement authentication in
                  Next.js 15 using NextAuth.js. It shows how to:
                </p>
                <ul>
                  <li>Set up Google authentication</li>
                  <li>Protect routes using middleware</li>
                  <li>
                    Create a user interface that changes based on login status
                  </li>
                  <li>Redirect users after login</li>
                </ul>
                <p>
                  The app demonstrates both server-side and client-side
                  authentication checks, providing a complete authentication
                  solution.
                </p>
                <h2 className="dark:text-white">Technologies Used</h2>
                <ul>
                  <li>Next.js 15</li>
                  <li>NextAuth.js</li>
                  <li>React 19</li>
                  <li>Tailwind CSS</li>
                  <li>Drizzle ORM</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
