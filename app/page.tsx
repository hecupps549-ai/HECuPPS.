import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/UI/Button';
import { Input } from '@/components/UI/Input';
import { TESTIMONIALS } from '@/constants';

const HomePage = () => {
    const categories = [
        { name: 'Birthday', img: 'https://picsum.photos/seed/birthday/600/800' },
        { name: 'Festive', img: 'https://picsum.photos/seed/festive/600/800' },
        { name: 'Corporate', img: 'https://picsum.photos/seed/corporate/600/800' },
        { name: 'Wedding', img: 'https://picsum.photos/seed/wedding/600/800' },
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[70vh] min-h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/seed/luxury/1920/1080')" }}>
                <div className="absolute inset-0 bg-brand-dark bg-opacity-50" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                    <h1 className="text-5xl md:text-7xl font-playfair font-bold leading-tight">Curated Luxury, Wrapped with Love</h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl font-poppins">Discover our exquisite collection of handcrafted gift hampers, designed to make every occasion memorable.</p>
                    <Link href="/products">
                      <Button className="mt-8 text-xl">Explore Hampers</Button>
                    </Link>
                </div>
            </section>

            {/* Featured Categories */}
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-playfair font-bold text-center mb-12 text-brand-dark dark:text-brand-cream">Our Collections</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {categories.map(cat => (
                            <Link href="/products" key={cat.name}>
                                <div className="group relative overflow-hidden rounded-lg shadow-lg aspect-[3/4]">
                                    <Image src={cat.img} alt={cat.name} fill style={{objectFit: 'cover'}} className="group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                                        <h3 className="text-2xl font-playfair font-semibold text-white">{cat.name}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Testimonials */}
            <section className="bg-brand-dark text-brand-cream py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-playfair font-bold text-center mb-12 text-white">Words of Appreciation</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <div key={index} className="bg-gray-800 p-8 rounded-lg">
                                <p className="text-lg italic">"{testimonial.quote}"</p>
                                <p className="mt-4 font-semibold text-brand-gold">{testimonial.author}</p>
                                <p className="text-sm text-gray-400">{testimonial.location}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Newsletter Section */}
             <section className="py-20 bg-brand-cream dark:bg-brand-dark">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
                    <h2 className="text-4xl font-playfair font-bold text-brand-dark dark:text-brand-cream">Stay in Touch</h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Join our newsletter to receive exclusive offers, new collection announcements, and gifting inspiration straight to your inbox.</p>
                    <form className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Input type="email" placeholder="Enter your email address" className="flex-grow dark:bg-gray-800 dark:text-white dark:placeholder-gray-400" />
                        <Button type="submit" variant="secondary">Subscribe</Button>
                    </form>
                </div>
            </section>
        </>
    );
};

export default HomePage;
