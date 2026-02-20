import React from "react";

const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1550009158-9ebf69173e03",
    title: "Minimalist Setup",
    size: "tall",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    title: "Code Focus",
    size: "wide",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    title: "Hardware Close-up",
    size: "standard",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8",
    title: "Network Infrastructure",
    size: "tall",
  }, // NEW STABLE LINK
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    title: "Network Hub",
    size: "standard",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    title: "Future Tech",
    size: "wide",
  },
];

const Gallery = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-black tracking-tight text-black sm:text-6xl">
          Visual Laboratory
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          A curation of engineered environments and premium hardware.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[300px]">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className={`relative group overflow-hidden rounded-3xl bg-gray-100 ${
                image.size === "tall"
                  ? "md:row-span-2"
                  : image.size === "wide"
                    ? "md:col-span-2"
                    : ""
              }`}
            >
              <img
                src={`${image.url}?auto=format&fit=crop&q=80&w=1200`}
                alt={image.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-end p-8">
                <p className="text-white font-bold text-xl">{image.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
