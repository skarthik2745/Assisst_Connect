import React, { useState } from 'react'
import { ArrowLeft, User, Mail, Camera, LogOut, Upload } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface ProfileProps {
  onBack: () => void
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const { user, signOut, updateProfile } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage('')

    try {
      // Create a simple data URL for the profile picture
      const reader = new FileReader()
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string
        
        const { error } = await updateProfile({
          avatar_url: imageUrl
        })

        if (error) {
          setMessage('Failed to update profile picture')
        } else {
          setMessage('Profile picture updated successfully!')
        }
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setMessage('Failed to upload image')
      setUploading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    onBack()
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-8 space-y-4 sm:space-y-0">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 subheading-text hover:text-white transition-colors duration-200 sm:mr-6 self-start"
        >
          <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base">Back</span>
        </button>
        
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
            <User size={20} className="sm:w-6 sm:h-6 icon-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold heading-text">Profile</h1>
            <p className="subheading-text text-sm sm:text-base">Manage your account settings</p>
          </div>
        </div>
      </div>

      {/* Profile Card */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-8">
          {/* Profile Picture */}
          <div className="relative">
            <div 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center border-2 overflow-hidden"
              style={{
                border: '2px solid rgba(0, 229, 255, 0.3)',
                background: user?.user_metadata?.avatar_url 
                  ? `url(${user.user_metadata.avatar_url})` 
                  : 'rgba(255, 255, 255, 0.1)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!user?.user_metadata?.avatar_url && (
                <User size={40} className="sm:w-12 sm:h-12 icon-aqua" />
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200">
              <Camera size={16} className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold heading-text mb-2">
              {user?.user_metadata?.username || 'User'}
            </h2>
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-4">
              <Mail size={16} className="icon-aqua" />
              <span className="paragraph-text">{user?.email}</span>
            </div>
            
            {message && (
              <div 
                className="p-3 rounded-lg mb-4"
                style={{
                  background: message.includes('success') 
                    ? 'rgba(34, 197, 94, 0.1)' 
                    : 'rgba(239, 68, 68, 0.1)',
                  border: message.includes('success')
                    ? '1px solid rgba(34, 197, 94, 0.3)'
                    : '1px solid rgba(239, 68, 68, 0.3)',
                  color: message.includes('success') ? '#86efac' : '#fca5a5'
                }}
              >
                {message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <label className="btn-secondary px-6 py-3 rounded-lg font-semibold cursor-pointer inline-flex items-center justify-center space-x-2">
                <Upload size={16} />
                <span>{uploading ? 'Uploading...' : 'Change Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              
              <button
                onClick={handleSignOut}
                className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center space-x-2"
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                  border: '1px solid rgba(239, 68, 68, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h3 className="text-xl font-bold heading-text mb-6">Account Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium subheading-text mb-2">
              Username
            </label>
            <div 
              className="w-full p-3 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                color: '#f8fafc'
              }}
            >
              {user?.user_metadata?.username || 'Not set'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium subheading-text mb-2">
              Email
            </label>
            <div 
              className="w-full p-3 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                color: '#f8fafc'
              }}
            >
              {user?.email}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium subheading-text mb-2">
              Account Created
            </label>
            <div 
              className="w-full p-3 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(0, 229, 255, 0.2)',
                color: '#f8fafc'
              }}
            >
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium subheading-text mb-2">
              Status
            </label>
            <div 
              className="w-full p-3 rounded-lg flex items-center space-x-2"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#86efac'
              }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile