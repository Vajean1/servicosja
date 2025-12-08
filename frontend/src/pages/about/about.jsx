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

                <p data-aos="fade-right">A Serviços JA nasceu de uma frustração comum e universal: a busca por um profissional de confiança. Em 2025, nossa equipe se deparou com a lentidão e a insegurança das formas tradicionais de contratação, percebendo que o mercado carecia de uma solução que fosse verdadeiramente rápida e segura.</p>
                <p data-aos="fade-right">O momento de virada foi a percepção de que não bastava listar profissionais; era preciso garantir a conexão e a qualidade. Por que o cliente não pode ter um serviço resolvido agora e por que o profissional local não pode ter uma rede que lhe garanta renda estável e sem burocracia?</p>
                <p data-aos="fade-right">Nossa missão é simplificar a vida das pessoas e valorizar o trabalho profissional, criando conexões confiáveis e ágeis que transformam necessidades em soluções. Para isso, somos guiados por pilares inegociáveis:</p>
            </section >

            <div className={styles.modalContainer}>
                <div data-aos="flip-left" className={styles.modalContent}>
                    <img src="/img/buttons/Rectangle1.png" alt="modal" />
                    <h4>Agilidade Inovadora</h4>
                    
                </div>

                 <div data-aos="flip-left" className={styles.modalContent}>
                    <img src="/img/buttons/Rectangle2.png" alt="modal" />
                    <h4>Confiança e Transparência</h4>
                    
                </div>

                 <div data-aos="flip-left" className={styles.modalContent}>
                    <img src="/img/buttons/Rectangle3.png" alt="modal" />
                    <h4>Qualidade e Expertise</h4>
                    
                </div>

                 <div data-aos="flip-left" className={styles.modalContent}>
                    <img src="/img/buttons/Rectangle4.png" alt="modal" />
                    <h4>Impacto Local</h4>
                    
                </div>
            </div>


           

            <section  className={styles.teamContainer} >
                <h2>Conheça o Time que Faz a Magia Acontecer, JÁ!</h2>

                <div className={styles.teamContent}>

                    
                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/renata.png" alt="" />
                        <h4>Renata Santiago</h4>
                        <p>Professora | Lider tecnico</p>
                    </div>

                    
                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/alana.jpeg" alt="" />
                        <h4>Alanna Santos</h4>
                        <p>Lider Design</p>
                    </div>

                    
                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/marcos.jpeg" alt="" />
                        <h4>Marcos Ribeiro</h4>
                        <p>Lider Front-end</p>
                    </div>

                    
                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/thiago.jpeg" alt="" />
                        <h4>Thiago Nicolas</h4>
                        <p>Lider Back-end</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/abner.jpeg" alt="" />
                        <h4>Abner de Lima</h4>
                        <p>Front-end | Design</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/ana.jpeg" alt="" />
                        <h4>Ana Beatriz</h4>
                        <p>Front-end</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/bruno.png" alt="" />
                        <h4>Weydson Bruno</h4>
                        <p>Front-end</p>
                    </div>

                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/fernanda.jpeg" alt="" />
                        <h4>Fernanda Barros</h4>
                        <p>Front-end</p>
                    </div>

                      <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/vinicius.jpeg" alt="" />
                        <h4>Vinícius Alencastro</h4>
                        <p>Front-end</p>
                    </div>


                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/cailane.jpeg" alt="" />
                        <h4>Cailane Vitória </h4>
                        <p>Front-end</p>
                    </div>


                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/verissimo.jpeg" alt="" />
                        <h4>João Veríssimo</h4>
                        <p>Front-end</p>
                    </div>


                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/marcus.jpeg" alt="" />
                        <h4>Marcos Vinicius</h4>
                        <p>Front-end</p>
                    </div>



                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/gustavo.jpeg" alt="" />
                        <h4>Luiz Gustavo</h4>
                        <p>Front-end</p>
                    </div>


                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/cicero.jpeg" alt="" />
                        <h4>Cícero Viegas</h4>
                        <p>Front-end</p>
                    </div>



                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/miguel.jpeg" alt="" />
                        <h4>Luiz Miguel</h4>
                        <p>Front-end</p>
                    </div>


                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/sarah.jpeg" alt="" />
                        <h4>Sarah Bezerra</h4>
                        <p>Back-end</p>
                    </div>



                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/joao.jpeg" alt="" />
                        <h4>João Victor</h4>
                        <p>Back-end</p>
                    </div>

                    
                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/wildson.jpeg" alt="" />
                        <h4>Wildson</h4>
                        <p>Back-end</p>
                    </div>


                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/pedrov.jpeg" alt="" />
                        <h4>Pedro Vinicius</h4>
                        <p>Back-end</p>
                    </div>

                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/inadilson.jpeg" alt="" />
                        <h4>Inadilson Paz</h4>
                        <p>Back-end</p>
                    </div>


                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/samara.jpeg" alt="" />
                        <h4>Samara Caiane</h4>
                        <p>back-end</p>
                    </div>


                    <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/rian.jpeg" alt="" />
                        <h4>Rian Felix</h4>
                        <p>Back-end</p>
                    </div>


                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/rayner.jpeg" alt="" />
                        <h4>Renyer Martins</h4>
                        <p>Back-end</p>
                    </div>


                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/alice.jpeg" alt="" />
                        <h4>Alice Cristina</h4>
                        <p>Back-end</p>
                    </div>

                    
                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/pedro.jpeg" alt="" />
                        <h4>João Pedro</h4>
                        <p>Back-end</p>
                    </div>

                    
                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/vilena.jpeg" alt="" />
                        <h4>Vilena Santana </h4>
                        <p>Back-end</p>
                    </div>

                      <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/henrrique.jpeg" alt="" />
                        <h4>Henrique</h4>
                        <p>Back-end</p>
                    </div>


                    
                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/matheus.jpeg" alt="" />
                        <h4>Mathews Andrade</h4>
                        <p>Chatbot | Design</p>
                    </div>

                    
                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/batista.jpeg" alt="" />
                        <h4>João Batista</h4>
                        <p>Design</p>
                    </div>

                    
                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/lukas.jpeg" alt="" />
                        <h4>José Lukas</h4>
                        <p>Design</p>
                    </div>

                                        
                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/iracele.png" alt="" />
                        <h4>Iracele Patricia</h4>
                        <p>Design</p>
                    </div>

                                        
                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/dioginis.jpeg" alt="" />
                        <h4>Diogenes Gabriel</h4>
                        <p>Documentação</p>
                    </div>

                                        
                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/niase.jpeg" alt="" />
                        <h4>Niase samara</h4>
                        <p>Documentação</p>
                    </div>

                                                            
                     <div data-aos="zoom-out" className={styles.teambox}>
                        <img src="/img/students/lucas.jpeg" alt="" />
                        <h4>Lucas Angelo</h4>
                        <p>Documentação</p>
                    </div>

                </div>
            </section>
        </div>
    )
}