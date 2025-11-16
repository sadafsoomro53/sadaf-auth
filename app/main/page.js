import { auth } from "../auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function MainPage() {
  // Server-side session validation
  const session = await auth()
  
  // Redirect to signin if no session exists
  if (!session) {
    redirect("/signin")
  }

  // Fetch data from public API on the server
  try {
    const response = await fetch("https://randomuser.me/api/?results=12&nat=us,gb,au&inc=name,email,phone,location,login,picture", {
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
    
    const users = data.results.map((user, index) => ({
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
      picture: user.picture?.large || null
    }))
    
    if (!Array.isArray(users) || users.length === 0) {
      throw new Error("No users data available")
    }
    
    return (
    <div className="min-h-screen bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Users Directory
            </h1>
            <p className="text-gray-600 text-lg">Server-rendered data from public API</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              >
                <div className="flex items-center gap-4 mb-4">
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{user.name}</h2>
                    <p className="text-gray-500 text-sm">@{user.username}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{user.location.city}, {user.location.country}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-xs text-gray-500">{user.location.state}</span>
                  <span className="text-blue-600 font-semibold group-hover:text-purple-600 transition-colors flex items-center gap-1">
                    View Details
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching users:", error)
    throw new Error(error.message || "Unable to load users. Please try again later.")
  }

}
