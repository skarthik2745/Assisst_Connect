import React, { useState } from 'react'
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

interface SignupProps {
  onClose: () => void
  onSwitchToLogin: () => void
}

const Signup: React.FC<SignupProps> = ({ onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    const { error } = await signUp(email, password, username)
    
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Account created successfully! Please check your email to verify your account.')
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
            border: '1px solid rgba(124, 58, 237, 0.3)',
            boxShadow: '0 0 30px rgba(124, 58, 237, 0.2)'
          }}
        >
          <div className="flex items-center justify-center mb-6">
            <h2 
              className="text-2xl font-bold"
              style={{color: '#7c3aed', textShadow: '0 0 15px rgba(124, 58, 237, 0.5)'}}
            >
              Join AssistConnect
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

          {success && (
            <div 
              className="mb-4 p-3 rounded-lg border"
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#86efac'
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#f8fafc'}}>
                Username
              </label>
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#7c3aed'}} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    color: '#f8fafc'
                  }}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#f8fafc'}}>
                Email
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#7c3aed'}} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    color: '#f8fafc'
                  }}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{color: '#f8fafc'}}>
                Password (minimum 8 characters)
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: '#7c3aed'}} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-lg transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    color: '#f8fafc'
                  }}
                  placeholder="Enter your password"
                  minLength={8}
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
              className="w-full py-3 rounded-lg font-semibold transition-all duration-300 btn-primary-alt"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{color: '#cbd5e1'}}>
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="font-semibold transition-colors duration-300 link-text"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup