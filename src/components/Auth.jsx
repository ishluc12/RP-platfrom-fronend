"use client"

   import '../index.css' 
import { useEffect, useState } from "react"
import { Eye, EyeOff, User, Mail, Lock, Phone, Building, Hash, FileText, Camera, LogIn, UserPlus } from "lucide-react"
import Api from "../services/api"

function Auth({ onAuthSuccess, route }) {
    const [isRegistering, setIsRegistering] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // Login fields
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Registration fields
    const [name, setName] = useState("")
    const [role, setRole] = useState("student")
    const [profilePicture, setProfilePicture] = useState("")
    const [bio, setBio] = useState("")
    const [phone, setPhone] = useState("")
    const [department, setDepartment] = useState("")
    const [studentId, setStudentId] = useState("")
    const [staffId, setStaffId] = useState("")

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setIsRegistering(route === "#/register")
        setError("")
    }, [route])

    const resetForm = () => {
        setEmail("")
        setPassword("")
        setName("")
        setRole("student")
        setProfilePicture("")
        setBio("")
        setPhone("")
        setDepartment("")
        setStudentId("")
        setStaffId("")
        setError("")
        setShowPassword(false)
    }

    const toggleMode = () => {
        resetForm()
        setIsRegistering(!isRegistering)
        window.location.hash = isRegistering ? "#/login" : "#/register"
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            let res
            if (isRegistering) {
                const registerData = {
                    name,
                    email,
                    password,
                    role,
                    ...(profilePicture && { profile_picture: profilePicture }),
                    ...(bio && { bio }),
                    ...(phone && { phone }),
                    ...(department && { department }),
                    ...(role === "student" && studentId && { student_id: studentId }),
                    ...(role === "lecturer" && staffId && { staff_id: staffId }),
                }
                res = await Api.auth.register(registerData)
            } else {
                res = await Api.auth.login({ email, password })
            }

            const token = res?.data?.token || res?.token
            const user = res?.data?.user || res?.user

            if (token) {
                localStorage.setItem("token", token)
            }

            onAuthSuccess(user || null)
            window.location.hash = "#/dashboard"
        } catch (err) {
            setError(err?.data?.message || err.message || (isRegistering ? "Registration failed" : "Login failed"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8">
                    <img src="/kigali_college_logo.png" alt="Kigali College Logo" className="mx-auto h-24 mb-4 object-contain" />
                </div>

                {/* Auth Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden backdrop-blur-sm">
                    {/* Header */}
                    <div className="bg-blue-600 px-8 py-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-700 opacity-20"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-center mb-2 px-4 py-2 text-white">
                                {isRegistering && (
                                    <UserPlus className="w-6 h-6 mr-2" />
                                )}
                                <h2 className="text-xl font-semibold text-white">
                                    {isRegistering ? "Create Account" : "Welcome Back"}
                                </h2>
                            </div>
                            <p className="text-white text-center text-sm py-1 px-2">
                                {isRegistering ? "Join our academic community" : "Sign in to your account"}
                            </p>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="px-8 py-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Registration Name Field */}
                            {isRegistering && (
                                <div className="space-y-2 transform transition-all duration-300 ease-in-out">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required={isRegistering}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Registration Additional Fields */}
                            {isRegistering && (
                                <div className="border-t border-gray-200 pt-5 mt-5 space-y-5 transform transition-all duration-300 ease-in-out">
                                    <h3 className="text-lg font-semibold text-gray-800">Additional Details</h3>

                                    {/* Role Selection - Full Width */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Role <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                                        >
                                            <option value="student">Student</option>
                                            <option value="lecturer">Lecturer</option>
                                            <option value="administrator">Administrator</option>
                                            <option value="sys_admin">System Administrator</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Department */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Department</label>
                                            <div className="relative group">
                                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                                <input
                                                    type="text"
                                                    value={department}
                                                    onChange={(e) => setDepartment(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                                                    placeholder="e.g., Computer Science"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                        </div>

                                        {/* Role-specific ID fields */}
                                        {role === "student" && (
                                            <div className="space-y-2 transform transition-all duration-300 ease-in-out">
                                                <label className="block text-sm font-medium text-gray-700">Student ID</label>
                                                <div className="relative group">
                                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                                    <input
                                                        type="text"
                                                        value={studentId}
                                                        onChange={(e) => setStudentId(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                                                        placeholder="Enter student ID"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {(role === "lecturer" || role === "administrator" || role === "sys_admin") && (
                                            <div className="space-y-2 transform transition-all duration-300 ease-in-out">
                                                <label className="block text-sm font-medium text-gray-700">Staff ID</label>
                                                <div className="relative group">
                                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                                    <input
                                                        type="text"
                                                        value={staffId}
                                                        onChange={(e) => setStaffId(e.target.value)}
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                                                        placeholder="Enter staff ID"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Profile Picture URL */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
                                            <div className="relative group">
                                                <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                                <input
                                                    type="url"
                                                    value={profilePicture}
                                                    onChange={(e) => setProfilePicture(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400"
                                                    placeholder="Enter profile picture URL"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                                        <div className="relative group">
                                            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                rows={3}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white hover:border-gray-400 resize-none"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 transform transition-all duration-300 ease-in-out">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="relative overflow-hidden rounded-lg">
                                <div className="absolute inset-0 bg-blue-600 opacity-10"></div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="relative z-10 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            {isRegistering ? "Creating Account..." : "Signing In..."}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            {isRegistering ? (
                                                <>
                                                    <UserPlus className="w-5 h-5 mr-2" />
                                                    Create Account
                                                </>
                                            ) : (
                                                <>
                                                    <LogIn className="w-5 h-5 mr-2" />
                                                    Sign In
                                                </>
                                            )}
                                        </div>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Toggle Mode */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={toggleMode}
                                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline"
                            >
                                {isRegistering ? (
                                    <>
                                        Already have an account? <span className="font-semibold">Sign In</span>
                                    </>
                                ) : (
                                    <>
                                        Don't have an account? <span className="font-semibold">Create Account</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Forgot Password Link (Login Only) */}
                        {!isRegistering && (
                            <div className="mt-4 text-center">
                                <a
                                    href="#/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>&copy; 2025 Kigali College. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default Auth