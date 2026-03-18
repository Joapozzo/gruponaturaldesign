'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import Section from './Section';
import Button from '@/components/ui/Button';
import Image from 'next/image';

const InstagramCTA = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [liked, setLiked] = useState<Record<number, boolean>>({});
    const [saved, setSaved] = useState<Record<number, boolean>>({});

    const handleInstagramClick = () => {
        window.open('https://www.instagram.com/naturaldesign.ntds/', '_blank');
    };

    const toggleLike = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleSave = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const posts = [
        { id: 1, image: '/imgs/instagram/ig_1.jpg', likes: 124, comments: 8 },
        { id: 2, image: '/imgs/instagram/ig_2.jpg', likes: 89, comments: 5 },
        { id: 3, image: '/imgs/instagram/ig_3.jpg', likes: 201, comments: 12 },
        { id: 4, image: '/imgs/instagram/ig_4.jpg', likes: 67, comments: 3 },
    ];

    return (
        <Section
            id="instagram-cta"
            padding="none"
            className="w-full bg-white h-screen overflow-hidden"
        >
            <div className="w-full px-4 lg:px-15 h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-2 h-full min-h-0 items-stretch">
                    {/* Texto - 30% (3 de 10 columnas) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-3 h-[50vh] sm:h-[60vh] lg:h-full min-h-[280px] flex flex-col justify-center px-8 lg:px-12 xl:px-16 py-12 lg:py-16 relative z-20 bg-gray-100"
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2"
                        >
                            Novedades
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="text-sm text-gray-600 leading-relaxed mb-6"
                        >
                            @naturaldesign.ntds
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-sm text-gray-500 leading-relaxed mb-8"
                        >
                            Descubrí nuestros últimos diseños y el proceso creativo detrás de cada prenda.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="pt-2"
                        >
                            <Button
                                variant="black"
                                size="md"
                                onClick={handleInstagramClick}
                            >
                                SEGUINOS
                                <motion.div animate={{ x: isHovered ? 4 : 0 }} transition={{ duration: 0.2 }}>
                                    <ArrowRight className="w-4 h-4" />
                                </motion.div>
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Grid 2x2 de fotos - 70% (7 de 10 columnas) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-7 grid grid-cols-2 grid-rows-2 gap-2 h-[50vh] sm:h-[60vh] lg:h-full min-h-[280px]"
                    >
                        {posts.map((post, index) => (
                            <motion.a
                                key={post.id}
                                href="https://www.instagram.com/naturaldesign.ntds/"
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                                viewport={{ once: true }}
                                className="relative overflow-hidden group cursor-pointer"
                            >
                                <Image
                                    src={post.image}
                                    alt={`Instagram ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {/* Overlay tipo publicación - fijo, sin hover */}
                                <div className="absolute bottom-0 left-0 right-0 px-2 py-2 sm:px-3 sm:py-2.5 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-between">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <button
                                            type="button"
                                            onClick={(e) => toggleLike(e, post.id)}
                                            className="p-1 rounded-full hover:bg-white/10 transition-colors"
                                            aria-label="Me gusta"
                                        >
                                            <motion.div
                                                animate={{ scale: liked[post.id] ? [1, 1.2, 1] : 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <Heart
                                                    className={`w-4 h-4 sm:w-5 sm:h-5 ${liked[post.id] ? 'fill-red-500 text-red-500' : 'text-white'}`}
                                                />
                                            </motion.div>
                                        </button>
                                        <span className="text-white text-xs font-medium min-w-[1.5rem]">
                                            {(post.likes || 0) + (liked[post.id] ? 1 : 0)}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => e.preventDefault()}
                                            className="p-1 rounded-full hover:bg-white/10 transition-colors"
                                            aria-label="Comentar"
                                        >
                                            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </button>
                                        <span className="text-white text-xs font-medium">{post.comments}</span>
                                        <button
                                            type="button"
                                            onClick={(e) => e.preventDefault()}
                                            className="p-1 rounded-full hover:bg-white/10 transition-colors"
                                            aria-label="Compartir"
                                        >
                                            <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => toggleSave(e, post.id)}
                                        className="p-1 rounded-full hover:bg-white/10 transition-colors"
                                        aria-label="Guardar"
                                    >
                                        <Bookmark
                                            className={`w-4 h-4 sm:w-5 sm:h-5 ${saved[post.id] ? 'fill-white text-white' : 'text-white'}`}
                                        />
                                    </button>
                                </div>
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
            </div>
        </Section>
    );
};

export default InstagramCTA;
