"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdModeEdit, MdBlock } from "react-icons/md";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { putRequest } from "@/app/(utils)/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/Auth.Context";
import Cabecera from "../Cabecera";

const appearanceInputs =
    "appearance-none block w-full disabled:bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none bg-white";

interface camposHabilitados {
    nombre: boolean;
    username: boolean;
    email: boolean;
}

const EMAIL_REG_EX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,40}$/i;

const MiPerfil = () => {
    const [camposHabilitados, setCamposHabilitados] =
        useState<camposHabilitados>({
            nombre: false,
            username: false,
            email: false,
        });
    const router = useRouter();
    const { isAuthenticated, user, loading } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    // Función para cambiar el estado de un campo específico
    const toggleCampo = (campo: keyof camposHabilitados) => {
        setCamposHabilitados((prevCamposHabilitados) => ({
            ...prevCamposHabilitados,
            [campo]: !prevCamposHabilitados[campo],
        }));
    };

    const onSubmit = handleSubmit((data: any) => {
        try {
            const request = {
                id: user?.id,
                nombre: data.nombre,
                username: data.username,
                email: data.email,
                rol: user?.rol,
            };
            putRequest("usuarios", request).then((response) => {
                if (!response.data.success) {
                    toast.error(response.data.message);
                } else {
                    toast.success(response.data.message, { duration: 4000 });
                    router.push("/");
                }
            });
        } catch (err) {
            console.log(err);
        }
    });

    useEffect(() => {
        setValue("nombre", user?.nombre);
        setValue("username", user?.username);
        setValue("email", user?.email);
        setValue("rol", user?.rol);
    }, [loading]);

    return (
        <div className=" mx-auto px-24">
            <Cabecera
                titulo="Mi Perfil"
                subtitulo="Aquí puedes gestionar tu perfil"
            />

            {user && (
                <form
                    className="max-w-lg mx-auto mt-10 bg-gray-50 p-10 rounded-xl"
                    onSubmit={onSubmit}
                >
                    {errors.nombre && (
                        <span className="text-red-500 text-xs italic ms-20">
                            {errors.nombre.message as string}
                        </span>
                    )}

                    <div className="mb-8 flex">
                        <label className="block py-3 text-sm font-medium text-gray-900 me-5">
                            Nombre:
                        </label>

                        <input
                            type="text"
                            id="nombre"
                            className={appearanceInputs}
                            disabled={!camposHabilitados.nombre}
                            {...register("nombre", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio",
                                },
                                maxLength: {
                                    value: 50,
                                    message:
                                        "El nombre no puede tener mas de 50 caracteres",
                                },
                            })}
                        />

                        <button
                            type="button"
                            className="text-gray-500 flex ms-5 p-3"
                            title="Editar"
                            onClick={() => toggleCampo("nombre")}
                        >
                            <MdModeEdit className="w-5 h-5 hover:text-gray-900 hover:border-slate-200" />
                        </button>
                    </div>

                    {errors.username && (
                        <span className="text-red-500 text-xs italic ms-20">
                            {errors.username.message as string}
                        </span>
                    )}

                    <div className="mb-8 flex">
                        <label className="block py-3 text-sm font-medium text-gray-900 me-5">
                            Usuario:
                        </label>

                        <input
                            type="text"
                            id="username"
                            className={appearanceInputs}
                            disabled={!camposHabilitados.username}
                            {...register("username", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio",
                                },
                                maxLength: {
                                    value: 50,
                                    message:
                                        "El usuario no puede tener mas de 50 caracteres",
                                },
                            })}
                        />

                        <button
                            type="button"
                            className="text-gray-500 flex ms-5 p-3"
                            title="Editar"
                            onClick={() => toggleCampo("username")}
                        >
                            <MdModeEdit className="w-5 h-5 hover:text-gray-900 hover:border-slate-200" />
                        </button>
                    </div>

                    {errors.email && (
                        <span className="text-red-500 text-xs italic flex ms-20">
                            {errors.email.message as string}
                        </span>
                    )}

                    <div className="mb-8 flex">
                        <label className="block py-3 text-sm font-medium text-gray-900 me-8">
                            Email:
                        </label>

                        <input
                            type="email"
                            id="email"
                            className={appearanceInputs}
                            disabled={!camposHabilitados.email}
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "Este campo es obligatorio",
                                },
                                maxLength: {
                                    value: 256,
                                    message:
                                        "El email no puede tener mas de 256 caracteres",
                                },
                                pattern: {
                                    value: EMAIL_REG_EX,
                                    message: "El Email no es valido",
                                },
                            })}
                        />

                        <button
                            type="button"
                            className="text-gray-500 flex ms-5 p-3"
                            title="Editar"
                            onClick={() => toggleCampo("email")}
                        >
                            <MdModeEdit className="w-5 h-5 hover:text-gray-900 hover:border-slate-200" />
                        </button>
                    </div>

                    <div className="mt-8 mb-5 flex">
                        <label className="block py-3 text-sm font-medium text-gray-900 me-11 ">
                            Rol:
                        </label>

                        <input
                            id="rol"
                            type="text"
                            className={appearanceInputs}
                            disabled
                            {...register("rol", {})}
                        ></input>

                        <button
                            type="button"
                            className="text-gray-500 flex ms-5 p-3"
                            title="El rol no se puede modificar, contacte con el administrador"
                        >
                            <MdBlock className="w-5 h-5 text-gray-900" />
                        </button>
                    </div>

                    <div className="flex flex-wrap mt-14 items-center ">
                        <div className="w-full px-3 flex justify-center">
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white font-bold  py-2 px-6 rounded-lg mr-5"
                                type="submit"
                            >
                                Guardar
                            </button>
                            <Link href="/">
                                <button className="border-2 border-gray-400 text-red-500 hover:text-red-700 hover:border-slate-600 uppercase text-xs xl:text-base font-bold py-2 px-6 rounded-lg">
                                    Volver
                                </button>
                            </Link>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};
export default MiPerfil;
