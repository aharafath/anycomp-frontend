import Image from "next/image";

const LeftImage = () => {
  return (
    <div className="relative hidden lg:block">
      <Image
        src="/images/SignUpClient_Image.png"
        alt="Office"
        className="absolute inset-0 h-full w-full object-cover"
        height={1000}
        width={1000}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Brand */}
      <div className="absolute top-8 left-10 text-white text-2xl font-extrabold tracking-wide">
        ANYCOMP
      </div>

      {/* Rating badge */}
      <div className="absolute top-24 right-10   px-6 py-4 w-[340px] h-auto">
        <Image
          src="/images/LoginClient_Component.png"
          alt="Office"
          className="absolute inset-0  w-full object-cover"
          height={1000}
          width={1000}
        />
      </div>

      {/* Features */}
      <div className="absolute bottom-64 left-10  p-6 w-[340px]">
        <Image
          src="/images/LoginClient_Component_2.png"
          alt="Office"
          className="absolute inset-0  w-full object-cover"
          height={1000}
          width={1000}
        />
      </div>
    </div>
  );
};

export default LeftImage;
