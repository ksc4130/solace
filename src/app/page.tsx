export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight">
            Don&apos;t navigate your health alone.
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Find an advocate who will help untangle your healthcare by phone or video—no matter what you need—covered by Medicare.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/advocate-search"
              className="bg-[#D4A574] text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-[#C19660] transition-colors"
            >
              Find an Advocate
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-light text-gray-700 mb-12">
            What can we help you with today?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Navigate a new diagnosis */}
            <a href="#" className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-2xl font-light">
                  Navigate a <span className="text-[#347866] font-normal">new diagnosis</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src="https://cdn.prod.website-files.com/632a21d0ec93a082b11988a0/65d577f2611a585c1062783b_navigation.svg" 
                  alt="healthcare icon illustration"
                  className="w-20 h-20"
                />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none">
                    <path d="M2.60449 6.50011H8.18949L5.74949 8.94011C5.55449 9.13511 5.55449 9.45511 5.74949 9.65011C5.94449 9.84511 6.25949 9.84511 6.45449 9.65011L9.74949 6.35511C9.94449 6.16011 9.94449 5.84511 9.74949 5.65011L6.45949 2.35011C6.26449 2.15511 5.94949 2.15511 5.75449 2.35011C5.55949 2.54511 5.55949 2.86011 5.75449 3.05511L8.18949 5.50011H2.60449C2.32949 5.50011 2.10449 5.72511 2.10449 6.00011C2.10449 6.27511 2.32949 6.50011 2.60449 6.50011Z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
            </a>

            {/* Care for your loved ones */}
            <a href="#" className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-2xl font-light">
                  Care for your <span className="text-[#D4A574] font-normal">loved ones</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src="https://cdn.prod.website-files.com/632a21d0ec93a082b11988a0/65d577f2611a585c1062783e_loved%20one.svg" 
                  alt="two hearts illustration"
                  className="w-20 h-20"
                />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none">
                    <path d="M2.60449 6.50011H8.18949L5.74949 8.94011C5.55449 9.13511 5.55449 9.45511 5.74949 9.65011C5.94449 9.84511 6.25949 9.84511 6.45449 9.65011L9.74949 6.35511C9.94449 6.16011 9.94449 5.84511 9.74949 5.65011L6.45949 2.35011C6.26449 2.15511 5.94949 2.15511 5.75449 2.35011C5.55949 2.54511 5.55949 2.86011 5.75449 3.05511L8.18949 5.50011H2.60449C2.32949 5.50011 2.10449 5.72511 2.10449 6.00011C2.10449 6.27511 2.32949 6.50011 2.60449 6.50011Z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
            </a>

            {/* Find a doctor or facility */}
            <a href="#" className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-2xl font-light">
                  Find a <span className="text-[#D4A574] font-normal">doctor or facility</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src="https://cdn.prod.website-files.com/632a21d0ec93a082b11988a0/65d577f2611a585c1062783c_facility.svg" 
                  alt="hospital illustration"
                  className="w-20 h-20"
                />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none">
                    <path d="M2.60449 6.50011H8.18949L5.74949 8.94011C5.55449 9.13511 5.55449 9.45511 5.74949 9.65011C5.94449 9.84511 6.25949 9.84511 6.45449 9.65011L9.74949 6.35511C9.94449 6.16011 9.94449 5.84511 9.74949 5.65011L6.45949 2.35011C6.26449 2.15511 5.94949 2.15511 5.75449 2.35011C5.55949 2.54511 5.55949 2.86011 5.75449 3.05511L8.18949 5.50011H2.60449C2.32949 5.50011 2.10449 5.72511 2.10449 6.00011C2.10449 6.27511 2.32949 6.50011 2.60449 6.50011Z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
            </a>

            {/* Take control of chronic illness */}
            <a href="#" className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-2xl font-light">
                  Take <span className="text-[#347866] font-normal">control</span> of chronic illness
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src="https://cdn.prod.website-files.com/632a21d0ec93a082b11988a0/65d577f2611a585c1062783f_control.svg" 
                  alt="flexed bicep illustration"
                  className="w-16 h-16"
                />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none">
                    <path d="M2.60449 6.50011H8.18949L5.74949 8.94011C5.55449 9.13511 5.55449 9.45511 5.74949 9.65011C5.94449 9.84511 6.25949 9.84511 6.45449 9.65011L9.74949 6.35511C9.94449 6.16011 9.94449 5.84511 9.74949 5.65011L6.45949 2.35011C6.26449 2.15511 5.94949 2.15511 5.75449 2.35011C5.55949 2.54511 5.55949 2.86011 5.75449 3.05511L8.18949 5.50011H2.60449C2.32949 5.50011 2.10449 5.72511 2.10449 6.00011C2.10449 6.27511 2.32949 6.50011 2.60449 6.50011Z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
            </a>

            {/* Better care coordination */}
            <a href="#" className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-2xl font-light">
                  Better <span className="text-[#347866] font-normal">care coordination</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src="https://cdn.prod.website-files.com/632a21d0ec93a082b11988a0/65d577f2611a585c1062783d_coordination.svg" 
                  alt="rotary phone illustration"
                  className="w-20 h-20"
                />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none">
                    <path d="M2.60449 6.50011H8.18949L5.74949 8.94011C5.55449 9.13511 5.55449 9.45511 5.74949 9.65011C5.94449 9.84511 6.25949 9.84511 6.45449 9.65011L9.74949 6.35511C9.94449 6.16011 9.94449 5.84511 9.74949 5.65011L6.45949 2.35011C6.26449 2.15511 5.94949 2.15511 5.75449 2.35011C5.55949 2.54511 5.55949 2.86011 5.75449 3.05511L8.18949 5.50011H2.60449C2.32949 5.50011 2.10449 5.72511 2.10449 6.00011C2.10449 6.27511 2.32949 6.50011 2.60449 6.50011Z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
            </a>

            {/* Get the answers you need */}
            <a href="#" className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-8 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-2xl font-light">
                  Get the <span className="text-[#D4A574] font-normal">answers</span> you need
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img 
                  src="https://cdn.prod.website-files.com/632a21d0ec93a082b11988a0/65d577f2611a585c10627840_answers.svg" 
                  alt="illustration magnifying glass"
                  className="w-16 h-16"
                />
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 12 12" fill="none">
                    <path d="M2.60449 6.50011H8.18949L5.74949 8.94011C5.55449 9.13511 5.55449 9.45511 5.74949 9.65011C5.94449 9.84511 6.25949 9.84511 6.45449 9.65011L9.74949 6.35511C9.94449 6.16011 9.94449 5.84511 9.74949 5.65011L6.45949 2.35011C6.26449 2.15511 5.94949 2.15511 5.75449 2.35011C5.55949 2.54511 5.55949 2.86011 5.75449 3.05511L8.18949 5.50011H2.60449C2.32949 5.50011 2.10449 5.72511 2.10449 6.00011C2.10449 6.27511 2.32949 6.50011 2.60449 6.50011Z" fill="currentColor"></path>
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
