import React, { useState, useRef } from 'react'
import { ArrowLeft, User, Mail, Camera, LogOut, Upload, Crop, X, Edit, Save } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface ProfileProps {
  onBack: () => void
}

const Profile: React.FC<ProfileProps> = ({ onBack }) => {
  const { user, signOut, updateProfile } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [showCropModal, setShowCropModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, scale: 1 })
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    username: '',
    email: ''
  })

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string
      setSelectedImage(imageUrl)
      setShowCropModal(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropSave = async () => {
    if (!selectedImage || !canvasRef.current) return

    setUploading(true)
    setMessage('')

    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new Image()
      img.onload = async () => {
        const size = 200
        canvas.width = size
        canvas.height = size
        
        ctx.save()
        ctx.beginPath()
        ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2)
        ctx.clip()
        
        const centerX = size / 2
        const centerY = size / 2
        const scaledWidth = img.width * cropArea.scale
        const scaledHeight = img.height * cropArea.scale
        
        ctx.drawImage(
          img,
          centerX - scaledWidth/2 + cropArea.x,
          centerY - scaledHeight/2 + cropArea.y,
          scaledWidth,
          scaledHeight
        )
        
        ctx.restore()
        
        const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.8)
        
        const { error } = await updateProfile({
          avatar_url: croppedImageUrl
        })

        if (error) {
          setMessage('Failed to update profile picture')
        } else {
          setMessage('Profile picture updated successfully!')
        }
        
        setShowCropModal(false)
        setSelectedImage(null)
        setUploading(false)
      }
      img.src = selectedImage
    } catch (error) {
      setMessage('Failed to crop image')
      setUploading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    onBack()
  }

  const handleEdit = () => {
    setEditData({
      username: user?.user_metadata?.username || '',
      email: user?.email || ''
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    setUploading(true)
    setMessage('')

    try {
      const { error } = await updateProfile({
        username: editData.username,
        email: editData.email
      })

      if (error) {
        setMessage('Failed to update profile')
      } else {
        setMessage('Profile updated successfully!')
        setIsEditing(false)
      }
    } catch (error) {
      setMessage('Failed to update profile')
    }
    setUploading(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      username: user?.user_metadata?.username || '',
      email: user?.email || ''
    })
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
                background: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {user?.user_metadata?.avatar_url ? (
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User size={40} className="sm:w-12 sm:h-12 icon-aqua" />
              )}
            </div>
            
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200">
              <Camera size={16} className="text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
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
                  onChange={handleImageSelect}
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
        
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold heading-text">Account Information</h3>
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="btn-secondary px-4 py-2 flex items-center space-x-2"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={uploading}
                className="btn-neon-green px-4 py-2 flex items-center space-x-2 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{uploading ? 'Saving...' : 'Save'}</span>
              </button>
              <button
                onClick={handleCancel}
                className="btn-secondary px-4 py-2"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium subheading-text mb-2">
              Username
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.username}
                onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full p-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  color: '#f8fafc'
                }}
                placeholder="Enter username"
              />
            ) : (
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
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium subheading-text mb-2">
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 rounded-lg transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  color: '#f8fafc'
                }}
                placeholder="Enter email"
              />
            ) : (
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
            )}
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

      {/* Crop Modal */}
      {showCropModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="heading-text text-lg">Crop Profile Image</h3>
              <button
                onClick={() => {
                  setShowCropModal(false)
                  setSelectedImage(null)
                }}
                className="icon-white hover:icon-cyan transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="relative mb-4 bg-black rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-80 object-contain"
                style={{
                  transform: `scale(${cropArea.scale}) translate(${cropArea.x}px, ${cropArea.y}px)`
                }}
              />
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  maskImage: 'radial-gradient(circle 100px at center, transparent 100px, black 100px)',
                  WebkitMaskImage: 'radial-gradient(circle 100px at center, transparent 100px, black 100px)'
                }}
              />
              <div 
                className="absolute top-1/2 left-1/2 w-52 h-52 border-2 border-white rounded-full pointer-events-none"
                style={{
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
            
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm subheading-text mb-2">Zoom</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={cropArea.scale}
                  onChange={(e) => setCropArea(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                  className="w-full slider"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm subheading-text mb-2">Move X</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={cropArea.x}
                    onChange={(e) => setCropArea(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                    className="w-full slider"
                  />
                </div>
                
                <div>
                  <label className="block text-sm subheading-text mb-2">Move Y</label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={cropArea.y}
                    onChange={(e) => setCropArea(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                    className="w-full slider"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCropSave}
                disabled={uploading}
                className="flex-1 btn-primary px-4 py-2 disabled:opacity-50"
              >
                <Crop size={16} className="mr-2" />
                {uploading ? 'Saving...' : 'Save Cropped Image'}
              </button>
              
              <button
                onClick={() => {
                  setShowCropModal(false)
                  setSelectedImage(null)
                }}
                className="btn-secondary px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

export default Profile