import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className='px-4 py-4 w-full'>
      <div className='w-full max-w-6xl mx-auto'>
        <div className='w-[130px]'>
          <Link href='/'>
            <Image
              alt='logo'
              priority
              width={441}
              height={180}
              src='/medibook_logo.png'
              className='w-[130px] aspect-auto bg-gray-200 rounded-full px-1'
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header