import React from 'react'
import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function UserDetailPage({ params }) {
    // Server-side session validation
    const session = await auth()
    
    // Redirect to signin if no session exists
    if (!session) {
        redirect("/signin")
    }

    const { id } = await params;
    
    // Validate the ID parameter
    if (!id || isNaN(Number(id))) {
        throw new Error("Invalid user ID")
    }
    
    // Fetch data from public API on the server using the dynamic segment
    try {
        const userId = Number(id)
        if (userId < 1 || userId > 12) {
            throw new Error(`User with ID ${id} not found`)
        }
        
        const response = await fetch("https://randomuser.me/api/?results=12&nat=us,gb,au&inc=name,email,phone,location,login,picture,dob", {
            cache: "no-store", // Ensure fresh data on each request
            next: { revalidate: 0 } // Always fetch fresh data
        })
        
        if (!response.ok) {
            throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (!data || !data.results || !Array.isArray(data.results)) {
            throw new Error("Invalid API response format")
        }
        
        const allUsers = data.results.map((user, index) => ({
            id: index + 1,
            name: `${user.name?.first || ''} ${user.name?.last || ''}`.trim() || 'Unknown',
            username: user.login?.username || `user${index + 1}`,
            email: user.email || 'N/A',
            phone: user.phone || 'N/A',
            location: {
                street: `${user.location?.street?.number || ''} ${user.location?.street?.name || ''}`.trim() || 'N/A',
                city: user.location?.city || 'N/A',
                state: user.location?.state || 'N/A',
                country: user.location?.country || 'N/A',
                postcode: user.location?.postcode || 'N/A'
            },
            picture: user.picture?.large || null,
            dob: user.dob?.date || null,
            age: user.dob?.age || null
        }))
        
        const user = allUsers.find(u => u.id === userId)
        
        if (!user) {
            throw new Error(`User with ID ${id} not found`)
        }
        
        return (
            <div className='min-h-screen bg-black py-12'>
                <div className='container mx-auto px-4 max-w-5xl'>
                    <Link 
                        href="/main"
                        className="inline-flex items-center gap-2 mb-6 text-blue-600 hover:text-purple-600 font-medium transition-colors group"
                    >
                        <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Users Directory
                    </Link>
                    
                    <div className='bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100'>
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                            {user.picture ? (
                                <img 
                                    src={user.picture} 
                                    alt={user.name}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                                />
                            ) : (
                                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-xl">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                            <div className="flex-1 text-center md:text-left">
                                <h1 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                                    {user.name}
                                </h1>
                                <p className="text-gray-500 text-xl">@{user.username}</p>
                                {user.age && (
                                    <p className="text-gray-400 text-sm mt-1">Age: {user.age}</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Contact & Address Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Contact Information
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Email</p>
                                        <p className="text-gray-700 font-medium">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                                        <p className="text-gray-700 font-medium">{user.phone}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 border border-purple-200">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Address
                                </h3>
                                <div className="space-y-2">
                                    <p className="text-gray-700 font-medium">
                                        {user.location.street}
                                    </p>
                                    <p className="text-gray-700 font-medium">
                                        {user.location.city}, {user.location.state}
                                    </p>
                                    <p className="text-gray-700 font-medium">
                                        {user.location.postcode}, {user.location.country}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                            <p className="text-sm text-gray-500">
                                User ID: <span className="font-semibold text-gray-700">{user.id}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.error("Error fetching user:", error)
        throw new Error(error.message || "Unable to load user. Please try again later.")
    }
}


