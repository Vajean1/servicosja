import BannerHome from '../../components/bannerHome/bannerHome'
import styles from './home.module.css'
import { VscTools } from "react-icons/vsc";
import { IoHammerOutline } from "react-icons/io5";
import { FaLaptop, FaStar ,FaInstagram ,FaTwitter,FaFacebook,FaLinkedin } from "react-icons/fa";
import { HiOutlineTruck } from "react-icons/hi";
import { FaPhoneVolume } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';

import 'swiper/css';
import { useNavigate } from 'react-router';

import { useEffect, useState } from 'react';
import ProviderServices from '../../services/provider';
import { useProviderContext } from '../../context/providerSelected';

export default function Home () {

    const navigate = useNavigate();
    const { setProviderSelected } = useProviderContext();

    const { getBestRatedProviders, getReviews } = ProviderServices();

    const [bestProviders, setBestProviders] = useState([]);
    const [topReviews, setTopReviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const providers = await getBestRatedProviders();
            if (providers && Array.isArray(providers)) {
                setBestProviders(providers.slice(0, 6));
            }

            const reviews = await getReviews();
            if (reviews && Array.isArray(reviews)) {
                const sortedReviews = reviews.sort((a, b) => b.nota - a.nota);
                setTopReviews(sortedReviews.slice(0, 6));
            }
        }
        fetchData();
    }, [getBestRatedProviders, getReviews]);

    return(
        <main className={styles.homeContainer}>
           <BannerHome/>

           <div className={styles.bannerRota}>
                <img src="/img/banner/bannerRota.png" alt="banner rotas" />
                <button onClick={() => navigate('/about')}> Saiba Mais</button>
           </div>

           <section className={styles.searched}>
                <div className={styles.lineSearched}></div>
                <h3>Nossos Serviços<br/>Mais Buscados</h3>
                <div className={styles.ContainerBoxSearched}>
                    <div data-aos="zoom-in" className={styles.BoxSearched}>
                        <VscTools className={styles.iconSearched} />
                        <h4 className={styles.BoxSearchedh4}>Manutenção</h4>
                        <p className={styles.BoxSearchedp}>Soluções rápidas e confiáveis para sua casa</p>
                    </div>

                    <div data-aos="zoom-in" className={styles.BoxSearched}>
                        <FaLaptop className={styles.iconSearched}/>
                        <h4 className={styles.BoxSearchedh4}>Tecnologia</h4>
                        <p className={styles.BoxSearchedp}>Soluções digitais para o seu negócio crescer</p>
                    </div>

                    <div data-aos="zoom-in" className={styles.BoxSearched}>
                        <IoHammerOutline className={styles.iconSearched}/>
                        <h4 className={styles.BoxSearchedh4}>Construção</h4>
                        <p className={styles.BoxSearchedp}>Reformas com qualidade e prazo garantido</p>
                    </div>

                    <div data-aos="zoom-in" className={styles.BoxSearched}>
                        <HiOutlineTruck className={styles.iconSearched}/>
                        <h4 className={styles.BoxSearchedh4}>Mudança</h4>
                        <p className={styles.BoxSearchedp}>Transporte seguro e ágil em todo o Brasil</p>
                    </div>
                </div>
           </section>
           

           <section className={styles.Sponsored}>
            <img className={styles.SponsoredBg} src="img/banner/bannerSponsored.png" alt='banner'/>

            <div className={styles.sponsoredContainer}>

                 <Swiper
                    modules={[Navigation, A11y]}
                    slidesPerView={1}
                    breakpoints={{
                        
                        640: {
                            slidesPerView: 2, 
                            spaceBetween: 20,
                        },
                        
                        1024: {
                            slidesPerView: 3, 
                            spaceBetween: 60,
                        },
                        
                        1440: {
                            slidesPerView: 4, 
                            spaceBetween: 120,
                        }}
                    }
                    
                    >
                    {bestProviders.map((provider) => (
                        <SwiperSlide key={provider.id}>
                            <div 
                                className={styles.sponsoredBox} 
                                onClick={() => {
                                    setProviderSelected(provider);
                                    navigate('/providerDatails');
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <img 
                                    src={provider.foto || "img/exemples/Group 8.png"} 
                                    alt={provider.nome} 
                                    style={{ objectFit: 'cover' }} 
                                />
                                <h3>{provider.nome}</h3>
                                <p>{provider.biografia ? (provider.biografia.length > 50 ? provider.biografia.substring(0, 50) + "..." : provider.biografia) : (provider.servico?.nome || provider.categoria)}</p>
                                <div className={styles.infosSponsored}>
                                    <div className={styles.txtSponsored}>
                                        <b>{provider.localizacao || "Localização"}</b>
                                        <p>Prestador</p>
                                    </div>
                                    <div className={styles.starSponsored}>
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} color={i < Math.round(provider.nota_media) ? "#ffc107" : "#e4e5e9"} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                    
                    {/* Fallback if no providers are loaded yet or error */}
                    {bestProviders.length === 0 && (
                         <SwiperSlide>
                            <div className={styles.sponsoredBox}>
                                <p>Carregando prestadores...</p>
                            </div>
                        </SwiperSlide>
                    )}

                </Swiper>

            </div>
           </section>

           <section className={styles.commentsContainer}>
                   <h4>Quem usa, <i>Recomenda</i>!</h4>

                   <div className={styles.commentsContent}>
                     <Swiper
                    modules={[Navigation, A11y]}
                    slidesPerView={1}
                    breakpoints={{
                        
                        
                        640: {
                            slidesPerView: 1, 
                            spaceBetween: 20,
                        },
                        
                        1024: {
                            slidesPerView: 2, 
                            spaceBetween: 40,
                        },
                        
                        1640: {
                            slidesPerView: 3, 
                            spaceBetween: 100,
                        }}
                    }
                    
                    >
                    {topReviews.map((review) => (
                        <SwiperSlide key={review.id}>
                            <div className={styles.comentsBox}>
                               <h5>{review.cliente_nome}</h5>
                               <img className={styles.comentsBoxAspas} src="/img/partners/aspas.svg" alt="" />
                               <p>{review.comentario}</p>
                               <div className={styles.starSponsored}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < review.nota ? "#ffc107" : "#e4e5e9"} />
                                    ))}
                                </div>
                             </div>
                        </SwiperSlide>
                    ))}

                    {/* Fallback */}
                    {topReviews.length === 0 && (
                        <SwiperSlide>
                            <div className={styles.comentsBox}>
                               <p>Carregando avaliações...</p>
                             </div>
                        </SwiperSlide>
                    )}

                </Swiper>
                   </div>
           </section>

           <div className={styles.contactContainer}>
                    <h4>Fale Conosco</h4>
                    <div className={styles.contactContent}>
                        <form>
                            <input type="text" name='name' placeholder='Nome' />
                            <input type="email" name='email' placeholder='Email' />
                            <input type="tel" name='tel' placeholder='Celular' />
                            <textarea name="contact-msg" id="contact-msg" placeholder='Escreva sua mensagem'></textarea>
                            <button>Enviar</button>
                        </form>

                        <div className={styles.contactSocial}>
                            <div className={styles.contactSocialBox}>
                                <div className={styles.SocialBoxIcon}>
                                    <FaPhoneVolume />
                                </div>

                                <div className={styles.SocialBoxTxt}>
                                    <h5>Telefone</h5>
                                    <p>(81) 99999-9999</p>
                                    <p>(81) 99999-9999</p>
                                </div>
                            </div>

                             <div className={styles.contactSocialBox}>
                                <div className={styles.SocialBoxIcon}>
                                    <IoMdMail />
                                </div>

                                <div className={styles.SocialBoxTxt}>
                                    <h5>Email</h5>
                                    <p>connect@servicosja.com</p>
                                    <p>servicosja@hotmail.com</p>
                                </div>
                            </div>

                            <h4>Acompanhe nossas redes sociais</h4>
                            <div className={styles.SocialBoxIcons}> <a href='https://www.linkedin.com/' target='_blank'  className={styles.iconbg}><FaLinkedin/></a> <a  href='https://www.instagram.com/' target='_blank'  className={styles.iconbg}><FaInstagram /></a > <a  href='https://www.instagram.com/' target='_blank'  className={styles.iconbg}><FaFacebook /></a > <a  href='https://www.instagram.com/' target='_blank'  className={styles.iconbg}><FaTwitter /></a ></div>
                                </div>
                                
                            </div>
                        </div>

            <section className={styles.tipsContainer}>
                <h4>Dicas antes de contratar</h4> 
                <div className={styles.tipsContent}>
                    <div className={styles.tipsBox}>
                        <img src="/img/boxs/boxHome1.png" alt="icone dica 1" />
                        <p>Como garantir a segurança na hora da contratação?</p>
                    </div>


                    <div className={styles.tipsBox}>
                        <img src="/img/boxs/boxHome2.png" alt="icone dica 1" />
                        <p>Como contratrar o primeiro serviço</p>
                    </div>

                    <div className={styles.tipsBox}>
                        <img src="/img/boxs/boxHome3.png" alt="icone dica 1" />
                        <p>O Negócio Mais Popular do Ano</p>
                    </div>
                </div>       
            </section>                
            
        </main>
    )
}
