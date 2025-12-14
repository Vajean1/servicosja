import styles from './plans.module.css'

export default function Plans () {
    return(
        <div className={styles.plansContainer}>
            <img className={styles.bannerPlanos} src="/img/banner/bannerPlanos.png" alt="" />
            <p className={styles.textoDestaque}>Explore nossos planos e <span className={styles.enfase}>desbloqueie benefícios incríveis</span>! Selecione o <span className={styles.enfase}>pacote perfeito</span> para começar hoje mesmo com mais praticidade, suporte e vantagens.</p>

            <section className={styles.planoGrid}>
                <div className={styles.cardPlano}>
                    <p className={styles.pOculto}>Ideal para iniciantes</p>
                    <div className={styles.cardPrincipal}>
                        <h2>Básico</h2>
                        <p className={styles.frasePlano}>Ideal para iniciantes</p>
                        <h1>Grátis</h1>
                        <ul>
                            <li className={styles.detalheOk}>Visibilidade basica na busca</li>
                            <li className={styles.detalheOk}>Área de Atuação até 5km.</li>
                            <li className={styles.detalheOk}>5 contatos liberados por mês</li>
                            <li className={styles.detalheX}>Chatbot IA</li>
                            <li className={styles.detalheX}>Selo Profissional 24h</li>
                            <li className={styles.detalheX}>Geolocalização prioritária</li>
                        </ul>
                        <button className={styles.buttonPlano}>Selecionar Plano</button>
                        <span className={styles.spanOculto}>ou consulte-nos</span>
                    </div>
                </div>

                <div className={styles.cardPlano}>
                    <p className={styles.pOculto}>Ideal para quem está crescendo</p>
                    <div className={styles.cardPrincipal}>
                        <h2>Intermediário</h2>
                        <p className={styles.frasePlano}>Ideal para quem está crescendo</p>
                        <h1>$29,90<span className={styles.valorDestaque}>/Mês</span></h1>
                        <ul>
                            <li className={styles.detalheOk}>Visibilidade padrão na busca</li>
                            <li className={styles.detalheOk}>Área de Atuação até 15km.</li>
                            <li className={styles.detalheOk}>20 contatos liberados por mês</li>
                            <li className={styles.detalheOk}>Chatbot IA</li>
                            <li className={styles.detalheX}>Selo Profissional 24h</li>
                            <li className={styles.detalheX}>Geolocalização prioritária</li>
                        </ul>
                        <button className={styles.buttonPlano}>Selecionar Plano</button>
                        <span className={styles.spanOculto}>ou consulte-nos</span>
                    </div>
                </div>

                <div className={styles.cardPlano}>
                    <p className={styles.pOculto}>Ideal para quem é exclusivo</p>
                    <div className={styles.cardPrincipal}>
                        <h2>Profissional</h2>
                        <p className={styles.frasePlano}>Ideal para quem é exclusivo</p>
                        <h1>$59,90<span className={styles.valorDestaque}>/Mês</span></h1>
                        <ul>
                            <li className={styles.detalheOk}>Visibilidade Otimizada</li>
                            <li className={styles.detalheOk}>Área de Atuação até 15km.</li>
                            <li className={styles.detalheOk}>Acesso ilimitado a pedidos.</li>
                            <li className={styles.detalheOk}>Chatbot IA</li>
                            <li className={styles.detalheOk}>Selo Profissional 24h</li>
                            <li className={styles.detalheOk}>Geolocalização prioritária</li>
                        </ul>
                        <button className={styles.buttonPlano}>Selecionar Plano</button>
                        
                        <span className={styles.spanOculto}>ou consulte-nos</span>
                    </div>
                </div>
            </section>
        </div>
    )
}