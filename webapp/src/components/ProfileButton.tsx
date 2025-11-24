import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { User, LogOut } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { trpc } from '@/lib/trpc'
import { clearSession } from '@/lib/auth'

export function ProfileButton() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: avatarData } = trpc.auth.avatar.useQuery()

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      clearSession()
      navigate('/login', { replace: true })
    },
    onError: () => {
      // Clear session anyway on error
      clearSession()
      navigate('/login', { replace: true })
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-10 w-10 rounded-full overflow-hidden border-2 border-border bg-muted hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          {avatarData?.avatar ? (
            <img
              src={avatarData.avatar}
              alt={t('profile_menu_profile')}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="h-4 w-4" />
          {t('profile_menu_profile')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
          <LogOut className="h-4 w-4" />
          {logoutMutation.isPending ? t('profile_menu_loggingOut') : t('profile_menu_logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
