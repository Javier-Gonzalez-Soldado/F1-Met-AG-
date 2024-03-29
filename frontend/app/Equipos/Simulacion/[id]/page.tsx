"use client";
import React, { useEffect, useState } from "react";
import Cabecera from "@/app/components/Cabecera";
import InputSelectField from "@/app/components/InputSelectField";
import InputButton from "@/app/components/InputButton";
import Loading from "@/app/components/Loading";
import { useForm } from "react-hook-form";
import { getRequest } from "@/app/(utils)/api";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { comsumoCombustible, Conduccion, EnergyRecoverySystem } from "./logic";
import VolverButton from "@/app/components/volverBtn";
import withAuth from "@/app/components/withAuth";

function getConduccionByIndex(index: string): Conduccion | undefined {
    switch (index) {
        case "1.05":
            return Conduccion.AHORRADOR;
        case "0.75":
            return Conduccion.NORMAL;
        case "0.4":
            return Conduccion.DEPOTENCIADO;
        default:
            return undefined;
    }
}

function filterData(data: any): {
    idCoche?: number;
    idCircuito?: number;
    conduccion?: Conduccion;
} {
    return {
        idCoche: data.coche !== "" ? Number.parseInt(data.coche) : undefined,
        idCircuito:
            data.circuito !== "" ? Number.parseInt(data.circuito) : undefined,
        conduccion: getConduccionByIndex(data.tipoConduccion),
    };
}

const Simulacion = () => {
    const [loading, setLoading] = useState(false);
    const [coches, setCoches] = useState<any[]>([]);
    const [circuitos, setCircuitos] = useState<any[]>([]);

    const params = useParams();
    const idEquipo = params.id;

    const [combustiblePorVuelta, setCombustiblePorVuelta] =
        useState<string>("");
    const [combustibleTotal, setCombustibleTotal] = useState<string>("");
    const [gananciaERSPorVuelta, setGananciaERSPorVuelta] =
        useState<string>("");
    const [vueltasParaCargarERS, setVueltasParaCargarERS] =
        useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const getCoches = async () => {
        try {
            setLoading(true);
            const response = await getRequest("coches/equipo/" + idEquipo);
            const data = await response.data;
            if (data.success == true) {
                const responseJson = data;
                const coches = responseJson.data;

                setCoches(coches);
                setLoading(false);
            } else {
                toast.error("Error al cargar los coches");
            }
        } catch (error) {
            toast.error("Error al cargar los coches");
        }
    };

    const getCircuitos = async () => {
        try {
            setLoading(true);
            const response = await getRequest("circuitos");
            const data = await response.data;
            if (data.success == true) {
                const responseJson = data;
                const circuitos = responseJson.data;

                setCircuitos(circuitos);
                setLoading(false);
            } else {
                toast.error("Error al cargar los circuitos");
            }
        } catch (error) {
            toast.error("Error al cargar los circuitos");
        }
    };

    useEffect(() => {
        getCoches();
        getCircuitos();
    }, []);

    const onSubmit = handleSubmit(async (data) => {
        const { idCoche, idCircuito, conduccion } = filterData(data);

        const coche = coches.find((coche) => coche.id === idCoche);
        const circuito = circuitos.find(
            (circuito) => circuito.id === idCircuito
        );

        if (!coche || !circuito) {
            toast.error("No se ha seleccionado un coche o un circuito");
            return;
        }

        setCombustiblePorVuelta(
            comsumoCombustible(circuito.longitud, coche.consumo).toFixed(4)
        );
        setCombustibleTotal(
            comsumoCombustible(
                circuito.longitud,
                coche.consumo,
                circuito.numeroVueltas
            ).toFixed(4)
        );

        if (conduccion === undefined) {
            setGananciaERSPorVuelta("");
            setVueltasParaCargarERS("");
        } else {
            const ers = new EnergyRecoverySystem(coche);
            setGananciaERSPorVuelta(
                ers.gainValForCircuito(circuito, conduccion).toFixed(4)
            );
            setVueltasParaCargarERS(
                ers.numVueltasToRecharge(circuito, conduccion).toFixed(4)
            );
        }
    });

    return loading ? (
        <Loading />
    ) : (
        <div className="px-24 mx-auto">
            <div>
                <Cabecera
                    titulo="Herramientas de simulación"
                    subtitulo="Seleccione un coche y un circuito"
                />
            </div>
            <form
                onSubmit={onSubmit}
                className="max-w-3xl mx-auto bg-gray-50 p-10 mt-10 rounded-xl"
            >
                <div className="my-4">
                    <div className="my-1 sm:w-[50%]">
                        <InputSelectField
                            label="Coche"
                            register={register}
                            name="coche"
                            errors={errors}
                            loading={loading}
                            options={coches}
                        />
                    </div>
                    <div className="my-1 sm:w-[50%]">
                        <InputSelectField
                            label="Circuito"
                            register={register}
                            name="circuito"
                            errors={errors}
                            loading={loading}
                            options={circuitos}
                        />
                    </div>
                </div>
                <hr></hr>
                <div className="grid md:grid-cols-3 gap-10">
                    <div>
                        <div>
                            <h1 className="text-xl  mt-5 font-bold">
                                Gasto de combustible
                            </h1>
                            <p className="text-xs text-gray-500 my-1">
                                Cantidad de combustible gastada en litros
                            </p>
                            <div>
                                <div className="my-3">
                                    <label className="block mb-1 text-sm font-medium text-gray-900">
                                        En cada vuelta:
                                    </label>
                                    <input
                                        disabled={true}
                                        type="number"
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500
                                    focus:border-red-500 block p-2.5 "
                                        value={combustiblePorVuelta}
                                    />
                                </div>
                                <div className="my-3">
                                    <label className="block mb-1 text-sm font-medium text-gray-900">
                                        Para todo el circuito:
                                    </label>
                                    <input
                                        disabled={true}
                                        type="number"
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500
                                    focus:border-red-500 block p-2.5 "
                                        value={combustibleTotal}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2">
                        <div>
                            <h1 className="text-xl  mt-5 font-bold">
                                Cálculo de ERS (Energy Recovery System)
                            </h1>
                            <p className="text-xs text-gray-500 my-1">
                                Sistema de recuperación de energía en frenadas
                                que se almacena en una batería.
                            </p>
                            <div>
                                <div className="">
                                    <label className="block mb-1 text-sm font-medium text-gray-900">
                                        Tipo de conducción
                                    </label>

                                    <select
                                        id="tipoConduccion"
                                        {...register("tipoConduccion", {
                                            required: {
                                                value: false,
                                                message: "Opcional",
                                            },
                                        })}
                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500
                                    focus:border-red-500 block p-2.5"
                                    >
                                        <option value="">
                                            Selecciona una opción
                                        </option>
                                        <option key={0} value={1.05}>
                                            Ahorrador (+5%)
                                        </option>
                                        <option key={1} value={0.75}>
                                            Normal (-25%)
                                        </option>
                                        <option key={2} value={0.4}>
                                            Deportivo (-60%)
                                        </option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div className="col-span-1 my-3">
                                        <label className="block mb-1 text-sm font-medium text-gray-900">
                                            Ganancia del sistema por vuelta
                                            (kWh):
                                        </label>
                                        <input
                                            disabled={true}
                                            type="number"
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500
                                    focus:border-red-500 block p-2.5 w-28"
                                            value={gananciaERSPorVuelta}
                                        />
                                    </div>
                                    <div className="my-3 col-span-1">
                                        <label className="block mb-1 text-sm font-medium text-gray-900">
                                            Número de vueltas necesarias para
                                            cargar la batería:
                                        </label>
                                        <input
                                            disabled={true}
                                            type="number"
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500
                                    focus:border-red-500 block p-2.5 w-28"
                                            value={vueltasParaCargarERS}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-5 flex">
                    <div className="me-5">
                        <InputButton label="Calcular" loading={loading} />
                    </div>
                    <div>
                        <VolverButton />
                    </div>
                </div>
            </form>
        </div>
    );
};
export default withAuth(Simulacion);
