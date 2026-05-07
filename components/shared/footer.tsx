import { APP_NAME } from '@/lib/constants'

const Footer = () => {
  return (
    <footer className="bg-gray-50/50 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex-center p-5">
        2026 {APP_NAME}. All Rights reserved.
      </div>
    </footer>
  )
}

export default Footer
