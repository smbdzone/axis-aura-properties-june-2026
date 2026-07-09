export type SpecificationItem = {
  id: string;
  label: string;
  icon: string;
  selected: boolean;
};

export type SpecificationGroupConfig = {
  title: string;
  subtitle: string;
  placeholder: string;
  items: SpecificationItem[];
};

export const amenitiesGroup: SpecificationGroupConfig = {
  title: "Amenities",
  subtitle: "(Icon 14 * 14)",
  placeholder: "Enter amenity",
  items: [
    {
      id: "luxury-finishing",
      label: "Luxury & High-end Finishing",
      icon: "streamline:diamond-2-solid",
      selected: true,
    },
    { id: "gym", label: "GYM", icon: "game-icons:gym-bag", selected: false },
    { id: "central-ac", label: "Central AC", icon: "ic:round-ac-unit", selected: false },
    { id: "beach-access", label: "Beach Access", icon: "majesticons:beach", selected: false },
    { id: "cctv", label: "CCTV Cameras", icon: "bxs:cctv", selected: true },
    { id: "cinema", label: "Cinema", icon: "mdi:cinema", selected: false },
    { id: "bbq", label: "BBQ", icon: "mdi:bbq", selected: false },
    { id: "playground", label: "Playground", icon: "mingcute:playground-fill", selected: false },
  ],
};

export const accessGroup: SpecificationGroupConfig = {
  title: "Access",
  subtitle: "(Icon 14 * 14)",
  placeholder: "Place/Minutes",
  items: [
    {
      id: "dunecrest-school",
      label: "5 mins Dunecrest American School",
      icon: "teenyicons:school-solid",
      selected: true,
    },
    {
      id: "global-village",
      label: "19 mins Global Village",
      icon: "flowbite:globe-solid",
      selected: false,
    },
    {
      id: "miracle-garden",
      label: "15 mins Dubai Miracle Garden",
      icon: "maki:garden",
      selected: false,
    },
    {
      id: "dubai-mall",
      label: "20 mins Dubai Mall",
      icon: "material-symbols:local-mall",
      selected: false,
    },
    {
      id: "dxb-airport",
      label: "20 mins Dubai International Airport",
      icon: "mdi:local-airport",
      selected: true,
    },
    {
      id: "mall-emirates",
      label: "20 mins Mall of Emirates",
      icon: "material-symbols:local-mall-rounded",
      selected: false,
    },
    {
      id: "burj-al-arab",
      label: "25 mins Burj Al Arab",
      icon: "mingcute:burj-al-arab-fill",
      selected: false,
    },
    {
      id: "img-world",
      label: "10 mins IMG World of Adventures",
      icon: "fluent:games-16-filled",
      selected: false,
    },
  ],
};

export const viewsGroup: SpecificationGroupConfig = {
  title: "Views",
  subtitle: "(Icon 14 * 14)",
  placeholder: "Place/Minutes",
  items: [
    {
      id: "community-view",
      label: "Community View",
      icon: "ri:community-fill",
      selected: true,
    },
    { id: "sea-view", label: "Sea View", icon: "iconoir:sea-and-sun", selected: false },
    { id: "pool-view", label: "Pool View", icon: "ph:swimming-pool-fill", selected: false },
    {
      id: "burj-khalifa-view",
      label: "Burj Khalifa View",
      icon: "mingcute:burj-khalifa-tower-fill",
      selected: false,
    },
    {
      id: "burj-ul-arab-view",
      label: "Burj ul Arab View",
      icon: "mingcute:burj-al-arab-fill",
      selected: true,
    },
    {
      id: "szr-view",
      label: "Sheikh Zayed Road View",
      icon: "material-symbols:flyover-rounded",
      selected: false,
    },
    {
      id: "mall-emirates-view",
      label: "Mall of Emirates",
      icon: "material-symbols:local-mall-rounded",
      selected: false,
    },
    {
      id: "img-adventures-view",
      label: "IMG World of Adventures",
      icon: "fluent:games-16-filled",
      selected: false,
    },
  ],
};

export const specificationGroups = [amenitiesGroup, accessGroup, viewsGroup];
