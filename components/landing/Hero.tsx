import Link from "next/link"

export default function Hero() {
  return (
    <section className="
      flex-1 w-full bg-primary
      flex items-center overflow-hidden
      px-6 md:px-16 lg:px-24
      py-8                
    ">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">

        {/* LEFT: Text */}
        <div className="flex-1 flex flex-col items-start gap-4 text-left">

          <h1 className="
            text-3xl            
            md:text-4xl         
            lg:text-5xl       
            font-extrabold leading-tight text-gray-900
          ">
            We Deliver Your Package
            <span className="text-green-700 block">
              Anywhere in the Philippines!
            </span>
          </h1>

          <p className="text-sm md:text-base text-gray-600 max-w-md">
            {/* 👆 REDUCED: was text-base md:text-lg */}
            Fast, reliable, and affordable logistics — from Luzon to Mindanao,
            we've got your deliveries covered.
          </p>

          <Link href={'booking'} className="
            bg-green-700 text-white font-semibold
            px-6 py-3          
            rounded-full
            hover:bg-green-800 transition-colors duration-200
            text-sm md:text-base  
          ">
            Book a Delivery
          </Link>

        </div>

        {/* RIGHT: Image */}
        <div className="flex-1 flex justify-center items-center w-full">
          <img
            src="/assets/landing-page/neltrick.png"
            alt="Neltrick delivery truck"
            className="
              w-full
              max-w-xs        
              md:max-w-md      
              lg:max-w-lg     
              object-contain drop-shadow-2xl
            "
          />
        </div>

      </div>
    </section>
  )
}