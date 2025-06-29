import { useContext, useEffect, useState } from "react";
import { createModal } from "../modal";
import { builderContext } from "@/context/builderContext.module";
import { dataContext } from "@/context/dataContext.module";
import { IoShareSocial } from "react-icons/io5";
import { twMerge } from "tailwind-merge";
import { STATUS, STATUSValue } from "@/resources/definitions";

import { ScheduleDateContainer, ScheduleTimeContainer, SurveySchedule } from "./publish/SurveySchedule.module";
import { PublishComponent, PublishSection, PublishTitle } from "./publish/Common.module";

type BuilderPublishProps = {
    isOpen: boolean,
    handleClose: () => void;
}

export const PublishModal = createModal("main", "start-date", "end-date", "start-time", "end-time");

export function BuilderPublish({ isOpen, handleClose }: BuilderPublishProps) {

    const { id, name } = useContext(builderContext);
    const keys = useContext(dataContext).data?.private.keys;

    const key = id && keys ? keys[id]?.survey : "n";

    const [status, setStatus] = useState<STATUSValue>(STATUS.disabled)

    const [startTime, setStartTime] = useState<Date | undefined>(new Date());
    const [endTime, setEndTime] = useState<Date | undefined>()

    useEffect(() => {
        if ((startTime?.getTime() ?? -Infinity) >= (endTime?.getTime() ?? Infinity)) {
            setEndTime(undefined)
        }

    }, [startTime, endTime])

    return (
        <PublishModal
            isOpen={isOpen}
            handleClose={handleClose}
            anchor="top"
            containerClassName="mt-12  not-sm:max-w-[100%] not-sm:w-full  sm:max-w-[520px] mb-12"
            contentClassName="flex flex-col w-full"
        >
            <PublishModal.Container container="main" defaultOpen>
                <PublishModal.Header className="pl-5 pr-3">
                    <PublishTitle>Publish  {`"${name}"`}</PublishTitle>
                </PublishModal.Header>

                <PublishSection>
                    <PublishComponent>
                        <PublishTitle>
                            Access sharing
                        </PublishTitle>

                        <div className="text-foreground/90">
                            {status === STATUS.active && <>Your survey <span className="font-semibold text-green-500">has been publish</span> and anyone with this link can apply your questions.</>}
                            {status === STATUS.scheduled && <>Your survey <span className="font-semibold text-neon-violet">has been scheduled</span> and anyone with this can apply when it starts.</>}
                            {status === STATUS.disabled && <>Your survey <span className="font-semibold text-red-500">is not published</span> and you can publish it whenever you’re ready.</>}
                            {status === STATUS.ended && (
                                <>Your survey has <span className="font-semibold text-green-600">ended</span> and all responses have been successfully collected. You can republish anytime.</>
                            )}
                        </div>

                        {
                            ([STATUS.active, STATUS.scheduled] as STATUSValue[]).includes(status) && (
                                <>
                                    <div className="flex gap-2 w-full items-center">
                                        <input className="focus:outline-0  border border-foreground/15 w-full  overflow-clip bg-foreground/5 rounded-md py-[0.1rem] text-lg px-3 text-foreground/60" value={`http://localhost:3000/apply/${id}/${key}`}>
                                        </input>
                                        <button className="p-1 flex gap-1 items-center px-2 rounded-md border border-foreground/15 bg-foreground/5 hover:bg-foreground/20"><IoShareSocial className="w-5 h-5" /> <div>Share</div></button>
                                    </div>
                                    <button className={twMerge(
                                        "p-1 mt-3 flex gap-1 items-center px-2 rounded-md border border-foreground/15 bg font-medium text-sm",
                                        "bg-gradient-to-br from-red-500/60 to-red-600/60 hover:to-red-500/80"
                                    )}>Revoke access</button>
                                </>
                            )
                        }
                    </PublishComponent>
                </PublishSection>

                <SurveySchedule start={startTime} end={endTime} onClick={() => { }} />

                <PublishSection>
                    <PublishComponent className="flex justify-between items-center">

                        {
                            ([STATUS.ended] as STATUSValue[]).includes(status) && (
                                <>
                                    <button className="bg-foreground/20 font-bold px-6 py-[0.3rem] rounded-md text-sm hover:bg-foreground/30">Clear all 43 applies</button>
                                    <button className="bg-foreground/20 font-bold px-6 py-[0.3rem] hover:bg-foreground/30 rounded-md text-sm">Republish</button>
                                </>)
                        }

                        {
                            ([STATUS.active] as STATUSValue[]).includes(status) && (
                                <>
                                    <button className="bg-foreground/20 font-bold px-6 py-[0.3rem] rounded-md text-sm hover:bg-foreground/30">Clear all 43 applies</button>
                                    <button className="bg-red-500/70 font-bold px-6 py-[0.3rem] hover:bg-red-500/90 rounded-md text-sm">Disable</button>
                                </>)
                        }

                        {
                            ([STATUS.disabled] as STATUSValue[]).includes(status) && (
                                <>
                                    <div className="text-foreground/70">All ready to publish</div>
                                    <button className="tail-button bg-foreground/20 font-bold px-6 py-[0.3rem] rounded-md">Publish</button>
                                </>)
                        }

                        {
                            ([STATUS.scheduled] as STATUSValue[]).includes(status) && (
                                <>
                                    <div className="text-foreground/70">You can disable the schedule</div>
                                    <button className="font-bold px-6 py-[0.3rem] hover:bg-red-500/90 rounded-md text-sm">Disable</button>
                                </>
                            )
                        }
                    </PublishComponent>
                </PublishSection>

            </PublishModal.Container>

            <ScheduleDateContainer variant="start" onChange={setStartTime} start={startTime} end={endTime} />
            <ScheduleDateContainer variant="end" onChange={setEndTime} start={startTime} end={endTime} />
            <ScheduleTimeContainer variant="start" onChange={setStartTime} start={startTime} end={endTime} />
            <ScheduleTimeContainer variant="end" onChange={setEndTime} start={startTime} end={endTime} />
        </PublishModal>
    )
}



/**
 * Metodologias
 * 
 * 0. Usar bloqueios visuais para que o usuário não tenha a sensação que pode alterar algo sem querer;
 *      a) Manter bloqueado, quando ativo ou agendado por exemplo, ou encerrado, as configurações da survey.
 *      Por exempo, não permitir editar as perguntas visualmente, fazer um popup antes de tudo dizendo: "Está em andamento, quer editar mesmo assim?"
 *      Não permitir editar dadas, horários, etc, e tudo que dá um "medo" de estragar tudo. Sentir seguro ao abrir o publish.
 *      
 *      b) Claridade no efeito de cada ação do usuário, pois as ações aqui podem acarretar em efeitos irrreversíveis.
 *         Então, quando ele for editar as perguntas com tudo em andamento, no popup de alerta, dizer com clareza o que vai acontecer.
 *         Ou quando ele for revogar o link, dizer com clareza o que vai acontecer ou expor a intencao com os toggles e descricoes.
 * 
 * 1. Usar janelas, ao invés de deixar tudo da publish em página única, e incluir páginas de feedback. 
 *      a) A página inicial da publish mostra cosias simples e padronizadas, de forma segura e estável, sem alterações.
 * 
 *         Botões e inputs que levam a eventos que podem mudar o estado, e por exmeplo, se ele quer publica e anunciar interesse nisso,
 *         leve-o para uma página onde ele vai fazer isso e configurar os horários, ao invés de simplesmente "blá".
 * 
 *         Se ele quer editar as datas de algo que já está no meio do caminho, tudo bem, aí pode ser com um botão de "editar" que libera as datas, mas o "Setup" inicial 
 *         de cada survey deve ser guiado, e não solto, as pequenas edições como "mudar data ou duraçõa" podem ser mais abertas. 
 * 
 * 2. Permitir facilmente com que ele volte em qualquer etapa;
 *    a) Usando por exemplo, o X como voltar no canto, como se as janelas estivessem em pilhas, ou um botão de voltar
 *    também no canto esquerdo, mas aí tem o risco dele confundir e tomar uma ação ruim, mas deixar o X para isso pode confundir também
 *    como se ele não tivesse opção de voltar, então manter os dois na página pode ser uma boa. Mas acho que a melhor opcão é abrir multiplos modals, e permitir arrastar
 *    eles, assim ele sente mais seguro e sabe onde exatamente está e que pode simplesmente fechar para voltar. Clicar fora não necessariamente
 *    fecharia o modal, teria que usar o X sempre.
 */

/**
 * O que precisa existir no modal de publish?
 * 1. Um acesso ao link para compartilhar, onde o dono da survey compartilha.
 *          a) Apertar um botão tipo confirmar e mostrar o link com um "OK".
 *          b) Apenas exibir no topo com o status;
 *          c) Os dois, para que ele possa tanto copiar quanto enviar, dando duas opções e caminhos que levam a mesma coisa se já existir um link;
 * 
 * 2. Precisa ter algumas opções de agendamento, com datas de início e fim, e horário de início e fim.
 *    Isso vai servir para que o usuário possa programar uma pesquisa.
 *          a) Com coisas simples, tipo, quando vai começar? Quanto tempo vai ficar aberto para respostas? Com horários.
 * 
 * 3. Alguma coisa que permita ele revogar o link de acesso.
 *      a) Não necessariamente fazer um novo link em seguida, mas ao menos não permitir o acesso mais;
 * 
 * 4. Limpeza das respostas.
 *      a) Com cuidado, para que ele não simplesmente corra o risco de esbarrar e apagar todas as respostas sem querer.
 */


/**
 * Dúvidas
 * 1. Como é a revogação e criação de links? 
 *      a) Apenas mudando a chave criptografica, assim, sem a chave e id corretos ninguém acessa a pesquisa, atualizou, revogou para sempre.
 *         Isso é diferente de mudar apenas um status, pois mudar um status ou condição como "desabilitar", ainda mantém a pessoa com o link original com acesso.
 *         Isso realmente muda tudo, e também faz com que respostas anteriores sejam apagadas, seria bom fazer um clean na tabela junto com a revogação.
 *         Deve ser fornecida uma opção também na revogação para limpar as perguntas anteriores do banco.
 * 
 * 2. E como saber se está aberto ou não?
 *      a) E o status serve exatamente para dizer se está publicado ou não, entende? Se ele estiver publicado, estará como "active" e não "disabled".
 *          Qual o fluxo: 
 *              1. DESATIVADO = disabled;
 *              2. AGENDADO  = active &&  now < dataInicial;
 *              3. ATIVO = active && now IN (dataIncial, dataFinal)
 *              4. ENCERRADO = active && now > dataFinal;
 * 
 *              Importante: O servidor será responsável por retornar o status, no banco ele deve usar apenas (DESATIVADO e ATIVO  com DATA INICIAL e DATA FINAL), 
 *              Se deixar na mão do cliente com data errada, vai estragar a UX.
 */