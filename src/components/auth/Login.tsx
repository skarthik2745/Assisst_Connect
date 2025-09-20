import React, { useState } from 'react'
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface LoginProps {
  onClose: () => void
  onSwitchToSignup: () => void
}

const Login: React.FC<LoginProps> = ({ onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
    } else {
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="animated-gradient-bg"></div>
      <div className="content-overlay w-full max-w-md">
        <div 
          className="glass-card rounded-2xl p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            boxShadow: '0 0 30px rgba(0, 229, 255, 0.2)'
          }}
        >
          <div className="flex items-center justify-center mb-6">
            <h2 
              className="text-2xl font-bold"
              style={{color: '#00e5ff', textShadow: '0 0 15px rgba(0, 229, 255, 0.5)'}}
            >
              Welcome to AssistConnect
            </h2>
          </div>

          {error && (
            <div 
              className="mb-4 p-3 rounded-lg border"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#f8fafc'}}>
                Email
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#00e5ff'}} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    color: '#f8fafc'
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#f8fafc'}}>
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#00e5ff'}} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-lg transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    color: '#f8fafc'
                  }}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                  style={{color: '#cbd5e1'}}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold transition-all duration-300 btn-primary"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{color: '#cbd5e1'}}>
              Don't have an account?{' '}
              <button
                onClick={onSwitchToSignup}
                className="font-semibold transition-colors duration-300 link-text"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login