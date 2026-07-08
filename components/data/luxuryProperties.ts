export type LuxuryProperty = {
  id: string;
  title: string;
  propertyType: string;
  description: string;
  rating: number;
  price: string;
  image: string;
};

export const luxuryProperties: LuxuryProperty[] = [
  {
    id: "ultra-luxury-masterpiece",
    title: "Ultra-Luxury Architectural Masterpiece",
    propertyType: "Megamansion",
    description:
      "This stunning beachfront estate reimagines modern coastal living. Designed with massive, textured stone cantilevered tiers and integrated tropical greenery, the villa seamlessly blends organic textures with clean, contemporary lines. The expansive wooden pool deck features a striking infinity-edge pool that mirrors the iconic Dubai skyline.",
    rating: 5.0,
    price: "AED 165M",
    image: "/extra/pinnacle.svg",
  },
  {
    id: "waterfront-penthouse",
    title: "Elite Waterfront Branded Residence",
    propertyType: "Penthouse",
    description:
      "An exclusive branded residence offering panoramic marina views, private elevator access, and bespoke interiors crafted for the global elite. Floor-to-ceiling glass walls frame the Arabian Gulf while world-class amenities deliver a legendary lifestyle.",
    rating: 5.0,
    price: "AED 98M",
    image: "/extra/pinnacle.svg",
  },
  {
    id: "palm-villa-estate",
    title: "Private Palm Island Villa Estate",
    propertyType: "Villa",
    description:
      "Set on the iconic Palm, this ultra-luxury villa pairs private beach access with resort-style living. Expansive terraces, a temperature-controlled pool, and refined architectural detailing define one of the UAE's most coveted addresses.",
    rating: 5.0,
    price: "AED 210M",
    image: "/extra/pinnacle.svg",
  },
];
