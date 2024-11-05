import React from 'react';

const MasterLayouts: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      
      {/* 1. Sidebar with Header and Main Content Area */}
      <div className="flex h-screen bg-gray-100">
        <aside className="w-64 bg-blue-700 text-white p-6">
          <h2 className="text-2xl font-bold mb-4">Sidebar</h2>
          <nav>
            <ul className="space-y-4">
              <li>Dashboard</li>
              <li>Projects</li>
              <li>Reports</li>
              <li>Settings</li>
            </ul>
          </nav>
        </aside>
        <div className="flex-grow p-6">
          <header className="bg-white p-4 shadow mb-6">
            <h1 className="text-xl font-bold">Dashboard Header</h1>
          </header>
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-6 shadow rounded-lg">Card 1</div>
            <div className="bg-white p-6 shadow rounded-lg">Card 2</div>
            <div className="bg-white p-6 shadow rounded-lg">Card 3</div>
          </main>
        </div>
      </div>

      {/* 2. Navigation Bar with Top-Level Navigation Links */}
      <div className="bg-white shadow">
        <nav className="flex justify-between items-center p-4">
          <div className="text-xl font-bold">AppName</div>
          <ul className="flex space-x-6">
            <li className="text-gray-700">Home</li>
            <li className="text-gray-700">Features</li>
            <li className="text-gray-700">Pricing</li>
            <li className="text-gray-700">Contact</li>
          </ul>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
        </nav>
      </div>

      {/* 3. Centered Modal for User Actions */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4">Modal Title</h2>
          <p className="mb-4">This is a centered modal used for user interactions.</p>
          <div className="flex space-x-4">
            <button className="flex-grow px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button className="flex-grow px-4 py-2 bg-blue-600 text-white rounded">Confirm</button>
          </div>
        </div>
      </div>

      {/* 4. Profile Section with Cover Image and Avatar */}
      <div className="max-w-xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="h-32 bg-blue-600"></div>
        <div className="p-6 flex items-center -mt-12">
          <img
            src="https://via.placeholder.com/64"
            alt="Profile avatar"
            className="w-24 h-24 rounded-full border-4 border-white mr-4"
          />
          <div>
            <h3 className="text-lg font-bold">John Doe</h3>
            <p className="text-gray-600">Software Engineer</p>
          </div>
        </div>
      </div>

      {/* 5. Three-Column Layout for Admin Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Column 1</h3>
          <p>Content for the first column goes here.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Column 2</h3>
          <p>Content for the second column goes here.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Column 3</h3>
          <p>Content for the third column goes here.</p>
        </div>
      </div>

      {/* 6. Footer with Links and Social Icons */}
      <footer className="bg-gray-800 text-white p-6">
        <div className="max-w-4xl mx-auto flex justify-between">
          <div>
            <h5 className="font-bold mb-2">Company</h5>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2">Support</h5>
            <ul className="space-y-2">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Status</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2">Follow Us</h5>
            <div className="flex space-x-4">
              <span>FB</span>
              <span>TW</span>
              <span>IG</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MasterLayouts;
