import BannerHome from '../../components/bannerHome/bannerHome'
import styles from './home.module.css'
import { VscTools } from "react-icons/vsc";
import { IoHammerOutline } from "react-icons/io5";
import { FaLaptop, FaStar } from "react-icons/fa";
import { HiOutlineTruck } from "react-icons/hi";


import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';

import 'swiper/css';




export default function Home () {
    return(
        <main className={styles.homeContainer}>
           <BannerHome/>

           <div className={styles.bannerRota}>
                <img src="/img/banner/bannerRota.jpeg" alt="banner rotas" />
           </div>

           <section className={styles.searched}>
                <div className={styles.lineSearched}></div>
                <h3>Nossos Serviços<br/>Mais Buscados</h3>
                <div className={styles.ContainerBoxSearched}>
                    <div className={styles.BoxSearched}>
                        <VscTools className={styles.iconSearched} />
                        <h4 className={styles.BoxSearchedh4}>Manutenção</h4>
                        <p className={styles.BoxSearchedp}>Soluções rápidas e confiáveis para sua casa</p>
                    </div>

                    <div className={styles.BoxSearched}>
                        <FaLaptop className={styles.iconSearched}/>
                        <h4 className={styles.BoxSearchedh4}>Tecnologia</h4>
                        <p className={styles.BoxSearchedp}>Soluções digitais para o seu negócio crescer</p>
                    </div>

                    <div className={styles.BoxSearched}>
                        <IoHammerOutline className={styles.iconSearched}/>
                        <h4 className={styles.BoxSearchedh4}>Construção</h4>
                        <p className={styles.BoxSearchedp}>Reformas com qualidade e prazo garantido</p>
                    </div>

                    <div className={styles.BoxSearched}>
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
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
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
                    <SwiperSlide>
                        <div className={styles.sponsoredBox}>
                            <img src="img/exemples/Group 8.png" alt="" />
                            <h3>Cristina Alves</h3>
                            <p>Especialista em massagens relaxantes e terapias naturais</p>
                            <div className={styles.infosSponsored}>
                                <div className={styles.txtSponsored}>
                                    <b>Recife</b>
                                    <p>Graças</p>
                                </div>
                                <div className={styles.starSponsored}>
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                             </div>
                         </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className={styles.sponsoredBox}>
                            <img src="img/exemples/Group 8.png" alt="" />
                            <h3>Cristina Alves</h3>
                            <p>Especialista em massagens relaxantes e terapias naturais</p>
                            <div className={styles.infosSponsored}>
                                <div className={styles.txtSponsored}>
                                    <b>Recife</b>
                                    <p>Graças</p>
                                </div>
                                <div className={styles.starSponsored}>
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                             </div>
                         </div>
                    </SwiperSlide>

                    <SwiperSlide>
                        <div className={styles.sponsoredBox}>
                            <img src="img/exemples/Group 8.png" alt="" />
                            <h3>Cristina Alves</h3>
                            <p>Especialista em massagens relaxantes e terapias naturais</p>
                            <div className={styles.infosSponsored}>
                                <div className={styles.txtSponsored}>
                                    <b>Recife</b>
                                    <p>Graças</p>
                                </div>
                                <div className={styles.starSponsored}>
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                             </div>
                         </div>
                    </SwiperSlide>


                    <SwiperSlide>
                        <div className={styles.sponsoredBox}>
                            <img src="img/exemples/Group 8.png" alt="" />
                            <h3>Cristina Alves</h3>
                            <p>Especialista em massagens relaxantes e terapias naturais</p>
                            <div className={styles.infosSponsored}>
                                <div className={styles.txtSponsored}>
                                    <b>Recife</b>
                                    <p>Graças</p>
                                </div>
                                <div className={styles.starSponsored}>
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                             </div>
                         </div>
                    </SwiperSlide>


                    <SwiperSlide>
                        <div className={styles.sponsoredBox}>
                            <img src="img/exemples/Group 8.png" alt="" />
                            <h3>Cristina Alves</h3>
                            <p>Especialista em massagens relaxantes e terapias naturais</p>
                            <div className={styles.infosSponsored}>
                                <div className={styles.txtSponsored}>
                                    <b>Recife</b>
                                    <p>Graças</p>
                                </div>
                                <div className={styles.starSponsored}>
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                             </div>
                         </div>
                    </SwiperSlide>


                </Swiper>

            </div>
           </section>

           <section className={styles.commentsContainer}>
                    <div className={styles.commentsBox}>
                        <h3>Quem usa, <i>Recomenda</i>! </h3>


                        <div className={styles.commentsBoxContentL1}>
                            <div className={styles.commentsBoxTxt}>
                                <h4>João Pedro</h4>
                                <div className={styles.starComments}>
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                            </div>
                            <p>Achei incrível poder avaliar direto pelo zap. Prático e rápido, igual o nome do site mesmo kkk</p>
                        </div>

                        <div className={styles.commentsBoxContentR1}>
                            <div className={styles.commentsBoxTxt}>
                                <h4>João Pedro</h4>
                                <div className={styles.starComments}>
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                            </div>
                            <p>Achei incrível poder avaliar direto pelo zap. Prático e rápido, igual o nome do site mesmo kkk</p>
                        </div>

                        <div className={styles.commentsBoxContentL2}>
                            <div className={styles.commentsBoxTxt}>
                                <h4>João Pedro</h4>
                                <div className={styles.starComments}>
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                            </div>
                            <p>Achei incrível poder avaliar direto pelo zap. Prático e rápido, igual o nome do site mesmo kkk</p>
                        </div>

                        <div className={styles.commentsBoxContentR2}>
                            <div className={styles.commentsBoxTxt}>
                                <h4>João Pedro</h4>
                                <div className={styles.starComments}>
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                </div>
                            </div>
                            <p>Achei incrível poder avaliar direto pelo zap. Prático e rápido, igual o nome do site mesmo kkk</p>
                        </div>
                    </div>


                    
                    <div className={styles.commentsNull}>
                        <img src="/img/comments/iPhone 15.png" alt="telefone" />
                    </div>
           </section>
        </main>
    )
}