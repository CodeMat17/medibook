import Image from "next/image";

const Header = () => {
  return (
    <div className='px-4 py-4 w-full'>
      <div className='w-full max-w-6xl mx-auto'>
        <Image
          alt='logo'
          priority
          width={441}
          height={180}
          src='/medibook_logo.png'
          className='w-[130px] aspect-auto bg-gray-200 rounded-full px-1'
        />
      </div>
    </div>
  );
}

export default Header