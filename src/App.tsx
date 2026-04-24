import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import BossPage from './pages/BossPage'
import SkillTree from './pages/SkillTree'
import AchievementsPage from './pages/AchievementsPage'
import NotificationToast from './components/ui/NotificationToast'
import OnboardingModal from './pages/OnboardingModal'
import { useGameStore } from './stores/gameStore'

export default function App() {
  const onboardingDone = useGameStore(s => s.onboardingDone)

  return (
    <BrowserRouter>
      <NotificationToast />
      {!onboardingDone && <OnboardingModal />}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/boss" element={<BossPage />} />
          <Route path="/skills" element={<SkillTree />} />
          <Route path="/achievements" element={<AchievementsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
