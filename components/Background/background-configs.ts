import { BackgroundConfig } from "@/types/background";

export const backgroundConfigs: Record<string, BackgroundConfig> = {
    home: {
        starPositions: [
            // Top-left quadrant - some partially off-screen
            { top: "-5%", left: "8%" },
            { top: "15%", left: "-3%" },
            { top: "7%", left: "18%" },

            // Top-right quadrant
            { top: "12%", left: "85%" },
            { top: "10%", left: "68%" },
            { top: "-2%", left: "95%" },

            // Top-center quadrant
            { top: "12%", left: "50%" },
            { top: "14%", left: "70%" },
            { top: "-2%", left: "30%" },

            // Bottom-left quadrant
            { top: "75%", left: "5%" },
            { top: "88%", left: "15%" },
            { top: "92%", left: "-4%" },

            // Bottom-right quadrant
            { top: "82%", left: "95%" },
            { top: "95%", left: "75%" },
            { top: "70%", left: "92%" },

            // Bottom-center quadrant
            { top: "82%", left: "50%" },
            { top: "95%", left: "70%" },
            { top: "70%", left: "30%" },
        ],
        animationVariants: ["slow", "medium", "fast"],
        clouds: {
            one: {
                position: { bottom: "-30%", left: "-20%" },
                size: { width: "20rem", height: "20rem" },
                zIndex: 20
            },
            two: {
                position: { bottom: "4%", right: "-10%" },
                size: { width: "20rem", height: "20rem" }
            }
        },
        suns: {
            left: {
                position: { top: "0", left: "0" },
                size: { width: "10rem", height: "10rem" },
                zIndex: 20,
                image: "/images/comic_sun_left.png"
            },
            right: {
                position: { top: "-20%", right: "-10%" },
                size: { width: "30rem", height: "30rem" },
                zIndex: 20,
                image: "/images/comic_sun.png"
            }
        }
    },
    // How-it-works background configuration
    howItWorks: {
        starPositions: [
            // Top-center quadrant - matching original
            { top: "12%", left: "50%" },
            { top: "14%", left: "70%" },
            { top: "-2%", left: "30%" },

            // Bottom-left quadrant - matching original
            { top: "75%", left: "5%" },
            { top: "88%", left: "15%" },
            { top: "92%", left: "-4%" },

            // Bottom-right quadrant - matching original
            { top: "82%", left: "95%" },
            { top: "95%", left: "75%" },
            { top: "70%", left: "92%" },

            // Bottom-center quadrant - matching original
            { top: "82%", left: "50%" },
            { top: "95%", left: "70%" },
            { top: "70%", left: "30%" },
        ],
        animationVariants: ["slow", "medium", "fast"],
        clouds: {
            one: {
                // Matching Bottom Left Cloud from original
                position: { top: "40%", left: "-10%" },
                size: { width: "20rem", height: "20rem" },
                zIndex: 10
            },
            two: {
                // Matching Bottom Right Cloud from original
                position: { bottom: "-15%", right: "5%" },
                size: { width: "20rem", height: "20rem" }
            }
        },
        suns: {
            left: {
                // Matching Top Left Sun from original
                position: { top: "0", left: "0" },
                size: { width: "14rem", height: "14rem" },
                zIndex: 20,
                image: "/images/comic_sun_left.png"
            },
            right: {
                // Matching Top Right Sun from original
                position: { top: "30%", right: "-15%" },
                size: { width: "30rem", height: "30rem" },
                zIndex: 20,
                image: "/images/comic_sun.png"
            }
        }
    },

    // ImageUpload background configuration
    imageUpload: {
        starPositions: [
            // Top-left quadrant - some partially off-screen
            { top: "-5%", left: "8%" },
            { top: "15%", left: "-3%" },
            { top: "7%", left: "18%" },

            // Top-right quadrant
            { top: "12%", left: "85%" },
            { top: "10%", left: "68%" },
            { top: "-2%", left: "95%" },

            // Top-center quadrant
            { top: "12%", left: "50%" },
            { top: "14%", left: "70%" },
            { top: "-2%", left: "30%" },

            // Bottom-left quadrant
            { top: "75%", left: "5%" },
            { top: "88%", left: "15%" },
            { top: "92%", left: "-4%" },

            // Bottom-right quadrant
            { top: "82%", left: "95%" },
            { top: "95%", left: "75%" },
            { top: "70%", left: "92%" },

            // Bottom-center quadrant
            { top: "82%", left: "50%" },
            { top: "95%", left: "70%" },
            { top: "70%", left: "30%" },
        ],
        animationVariants: ["slow", "medium", "fast"],
        clouds: {
            one: {
                position: { bottom: "20%", left: "-5%" },
                size: { width: "20rem", height: "20rem" },
                zIndex: 10
            },
            two: {
                position: { top: "10%", right: "-5%" },
                size: { width: "20rem", height: "20rem" }
            }
        },
        suns: {
            left: {
                position: { top: "0", left: "0" },
                size: { width: "14rem", height: "14rem" },
                zIndex: 20,
                image: "/images/comic_sun_left.png"
            },
            right: {
                position: { bottom: "-30%", left: "15%" },
                size: { width: "30rem", height: "30rem" },
                zIndex: 20,
                image: "/images/comic_sun.png"
            }
        }
    },
    // Mint background configuration
    mint: {
        starPositions: [
            // Top-center quadrant
            { top: "12%", left: "50%", animationDelay: "0.5s" },
            { top: "14%", left: "70%", animationDelay: "1.2s" },
            { top: "-2%", left: "30%", animationDelay: "0.8s" },

            // Bottom-left quadrant
            { top: "75%", left: "5%", animationDelay: "1.5s" },
            { top: "88%", left: "15%", animationDelay: "2.1s" },
            { top: "92%", left: "-4%", animationDelay: "0.3s" },

            // Bottom-right quadrant
            { top: "62%", left: "95%", animationDelay: "1.7s" },
            { top: "95%", left: "75%", animationDelay: "0.9s" },
            { top: "70%", left: "92%", animationDelay: "2.3s" },

            // Bottom-center quadrant
            { top: "52%", left: "50%", animationDelay: "1.1s" },
            { top: "75%", left: "70%", animationDelay: "0.7s" },
            { top: "70%", left: "10%", animationDelay: "1.9s" }
        ],
        animationVariants: ["slow", "medium", "fast"],
        clouds: {
            one: {
                position: { top: "-15%", left: "2%" },
                size: { width: "20rem", height: "20rem" },
                zIndex: 10
            },
            two: {
                position: { top: "40%", left: "-10%" },
                size: { width: "20rem", height: "20rem" }
            }
        },
        suns: {
            left: {
                position: { bottom: "-25%", right: "15%" },
                size: { width: "30rem", height: "30rem" },
                zIndex: 20,
                image: "/images/comic_sun.png"
            },
            right: {
                position: { top: "0", right: "0" },
                size: { width: "14rem", height: "14rem" },
                zIndex: 20,
                image: "/images/comic_sun_right.png"
            }
        }
    },
    // EditComic background configuration
    editComic: {
        starPositions: [], // No stars needed
        animationVariants: ["slow", "medium", "fast"],
        clouds: {
            one: {
                position: { top: "20rem", right: "1.25rem" }, // Cloud position
                size: { width: "15rem", height: "15rem" },
                zIndex: 20,
            },
            two: {
                position: { bottom: "-30%", left: "-20%" }, // Hidden cloud
                size: { width: "0", height: "0" },
            }
        },
        suns: {
            left: {
                position: { top: "-17.5rem", left: "2.5rem" }, // Sun position
                size: { width: "25rem", height: "25rem" },
                zIndex: 20,
                className: "opacity-50",
                image: "/images/comic_sun.png"
            },
            right: {
                position: { top: "0", right: "-100%" }, // Hidden sun
                size: { width: "14rem", height: "14rem" },
                image: "/images/comic_sun_right.png"
            }
        }
    },

    // Checkout background configuration
    checkout: {
        starPositions: [
            { top: "12%", left: "50%" },
            { top: "14%", left: "70%" },
            { top: "-2%", left: "30%" },
            { top: "75%", left: "5%" },
            { top: "88%", left: "15%" },
            { top: "92%", left: "-4%" },
            { top: "62%", left: "95%" },
            { top: "95%", left: "75%" },
            { top: "70%", left: "92%" },
            { top: "52%", left: "50%" },
            { top: "75%", left: "70%" },
            { top: "70%", left: "10%" },
        ],
        animationVariants: ["slow", "medium", "fast"],
        clouds: {
            one: {
                position: { bottom: "90px", left: "10px" },
                size: { width: "240px", height: "240px" },
                zIndex: 40,
            },
            two: {
                position: { top: "90px", right: "-10px" },
                size: { width: "360px", height: "360px" },
            },
        },
        suns: {
            left: {
                position: { top: "0", left: "0" },
                size: { width: "248px", height: "248px" },
                zIndex: 20,
                image: "/images/comic_sun_left.png"
            },
            right: {
                position: { bottom: "-20%", right: "10%" },
                size: { width: "480px", height: "480px" },
                zIndex: 20,
                image: "/images/comic_sun.png"
            },
        },
    },

    // Marketplace background configuration
    marketplace: {
        starPositions: [], // No stars for this version
        animationVariants: ["slow", "medium", "fast"],
        clouds: {
            one: {
                position: { top: "80px", right: "20px" },
                size: { width: "240px", height: "240px" },
            },
            two: {
                position: { top: "0", right: "0" },
                size: { width: "0", height: "0" },
            }
        },
        suns: {
            left: {
                position: { top: "0", left: "0" },
                size: { width: "400px", height: "400px" },
                zIndex: 20,
                image: "/images/comic_sun_left.png"
            },
            right: {
                position: { top: "0", right: "0" },
                size: { width: "0", height: "0" },
                image: ""
            }
        },
    },

    storyInput: {
        starPositions: [
            // Top-left quadrant
            { top: "-5%", left: "8%" },
            { top: "15%", left: "-3%" },
            { top: "7%", left: "18%" },

            // Top-right quadrant
            { top: "12%", left: "85%" },
            { top: "10%", left: "68%" },
            { top: "-2%", left: "95%" },

            // Top-center quadrant
            { top: "12%", left: "50%" },
            { top: "14%", left: "70%" },
            { top: "-2%", left: "30%" },

            // Bottom-left quadrant
            { top: "75%", left: "5%" },
            { top: "88%", left: "15%" },
            { top: "92%", left: "-4%" },

            // Bottom-right quadrant
            { top: "82%", left: "95%" },
            { top: "95%", left: "75%" },
            { top: "70%", left: "92%" },

            // Bottom-center quadrant
            { top: "82%", left: "50%" },
            { top: "95%", left: "70%" },
            { top: "70%", left: "30%" },
        ],
        animationVariants: ["slow", "medium", "fast"],
        clouds: {
            one: {
                position: { bottom: "20%", left: "-5%" },
                size: { width: "20rem", height: "20rem" },
                zIndex: 10
            },
            two: {
                position: { top: "10%", right: "-5%" },
                size: { width: "20rem", height: "20rem" }
            }
        },
        suns: {
            left: {
                position: { top: "0", left: "0" },
                size: { width: "14rem", height: "14rem" },
                zIndex: 20,
                image: "/images/comic_sun_left.png"
            },
            right: {
                position: { bottom: "-30%", left: "15%" },
                size: { width: "30rem", height: "30rem" },
                zIndex: 20,
                image: "/images/comic_sun.png"
            }
        }
    }
};