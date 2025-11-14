import styles from './bannerHome.module.css'

export default function BannerHome () {
    return(
        
            <section className={styles.bannerContainer} > 
                <div className={styles.txtContainer}>
                    <h2>Encontre  o <br/>Profissional Certo, <i>JÁ!</i></h2>
                    <p>Conectamos você aos melhores especialistas da sua<br/> região ,  com agilidade e confiança.</p>
                    <button>Solicitar Serviço</button>
                </div>
                <div className={styles.imgContainer}>
                    <img className={styles.imgUser} src="/img/banner/bannerHome.png" alt="serviços em todo brasil" />
                </div>
            </section>
        
    )
}