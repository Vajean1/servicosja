import styles from './about.module.css'

export default function About () {
    return(
        <div className={styles.aboutContainer}>
            <section className={styles.aboutBanner}>
                <img src="/img/banner/bannerAbout.jpeg" alt="banner sobre" />
            </section>

            <section data-aos="fade-right" className={styles.journeyContainer}>
                 <div className={styles.lineSearched}></div>
                <h3>A Jornada que nos<br/>Trouxe Até Aqui.</h3>

                <p data-aos="fade-right">Loren ipsun dolor sit anet, consectetur adipisci elit, sed eiusnod tenpor incidunt ut labore et dolore nagna aliqua. Ut enin ad ninin venian, quis nostrun exercitationen ullan corporis suscipit laboriosan, nisi ut aliquid ex ea connodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillun dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt nollit anin id est laborun.</p>
                <p data-aos="fade-right">Loren ipsun dolor sit anet, consectetur adipisci elit, sed eiusnod tenpor incidunt ut labore et dolore nagna aliqua. Ut enin ad ninin venian, quis nostrun exercitationen ullan corporis suscipit laboriosan, nisi ut aliquid ex ea connodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillun dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt nollit anin id est laborun.</p>
                <p data-aos="fade-right">Nossa missão é simplificar a vida das pessoas e valorizar o trabalho profissional, criando conexões confiáveis e ágeis que transformam necessidades em soluções. Para isso, somos guiados por pilares inegociáveis:</p>
            </section >

            <div className={styles.modalContainer}>
                <div data-aos="flip-left" className={styles.modalContent}>
                    <img src="/img/buttons/Rectangle1.png" alt="modal" />
                    <h4>Lorem Ips</h4>
                    <p>Lorem ips dolor sit amet, consecte</p>
                </div>

                 <div data-aos="flip-left" className={styles.modalContent}>
                    <img src="/img/buttons/Rectangle2.png" alt="modal" />
                    <h4>Lorem Ips</h4>
                    <p>Lorem ips dolor sit amet, consecte</p>
                </div>

                 <div data-aos="flip-left" className={styles.modalContent}>
                    <img src="/img/buttons/Rectangle3.png" alt="modal" />
                    <h4>Lorem Ips</h4>
                    <p>Lorem ips dolor sit amet, consecte</p>
                </div>

                 <div data-aos="flip-left" className={styles.modalContent}>
                    <img src="/img/buttons/Rectangle4.png" alt="modal" />
                    <h4>Lorem Ips</h4>
                    <p>Lorem ips dolor sit amet, consecte</p>
                </div>
            </div>


           

            <section  className={styles.teamContainer} >
                <h2>Conheça o Time que Faz a Magia Acontecer, JÁ!</h2>

                <div className={styles.teamContent}>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/exemples/Group 8.png" alt="" />
                        <h4>Lorem</h4>
                        <p>Lorem ips dolor sit amet, consecte</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/exemples/Group 8.png" alt="" />
                        <h4>Lorem</h4>
                        <p>Lorem ips dolor sit amet, consecte</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/exemples/Group 8.png" alt="" />
                        <h4>Lorem</h4>
                        <p>Lorem ips dolor sit amet, consecte</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/exemples/Group 8.png" alt="" />
                        <h4>Lorem</h4>
                        <p>Lorem ips dolor sit amet, consecte</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/exemples/Group 8.png" alt="" />
                        <h4>Lorem</h4>
                        <p>Lorem ips dolor sit amet, consecte</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/exemples/Group 8.png" alt="" />
                        <h4>Lorem</h4>
                        <p>Lorem ips dolor sit amet, consecte</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/exemples/Group 8.png" alt="" />
                        <h4>Lorem</h4>
                        <p>Lorem ips dolor sit amet, consecte</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/exemples/Group 8.png" alt="" />
                        <h4>Lorem</h4>
                        <p>Lorem ips dolor sit amet, consecte</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/exemples/Group 8.png" alt="" />
                        <h4>Lorem</h4>
                        <p>Lorem ips dolor sit amet, consecte</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/exemples/Group 8.png" alt="" />
                        <h4>Lorem</h4>
                        <p>Lorem ips dolor sit amet, consecte</p>
                    </div>

                </div>
            </section>
        </div>
    )
}