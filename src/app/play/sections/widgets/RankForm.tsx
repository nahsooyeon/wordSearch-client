
"use client";
import { GameInfoStore } from "@/app/store/GameInfo";
import { Input } from "@/components/Input";
import { modalStore } from "@/context/Modal";
import dayjs from "dayjs";
import { FunctionComponent, useActionState } from "react";
import { useStore } from "zustand";

type CreateRankReqDTO = {
	name: string;
	score: number;
};

interface RankFormModalProps {
	solvedCount: number;
	entireCount: number;
	id: string;
	usedTime: number;
}



const RankFormModal: FunctionComponent<RankFormModalProps> = ({ solvedCount, entireCount, id, usedTime }) => {
	const [error, submitAction, isPending] = useActionState(
		async (_previousState: null, formData: FormData) => {
			const error = await createRank({
				name: formData.get('name') as string,
				score: totalScore,
			});
			if (error) {
				throw error;
			}
			closeModal(id);
			reset();
			window.location.href = "/";
			return null;

		}, null
	);
	const { points, reset } = useStore(GameInfoStore);
	const { closeModal } = useStore(modalStore);
	const totalScore = points + (usedTime / 1000) * 100;

	const createRank = async (data: CreateRankReqDTO) => {
		try {
			await fetch(`/highscore/post`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
		} catch (error) {
			console.error(error);
			return error;
		}
	};


	return <div className={" flex my-auto bg-white flex-col w-[60vw] rounded-xl overflow-hidden h-[50vh]"}>
		<div className={"text-center w-full py-4 text-4xl bg-[#7BFE7F] rounded-t-md"}>
			GAME<br />COMPLETE
		</div>
		<div className={"flex flex-col h-full "}>
			<div className=" flex flex-col my-auto justify-center items-center">
				<p className="text-center text-5xl font-medium">{totalScore.toLocaleString()}</p>
				<p className="text-center text-base">points</p>
				<div className="flex gap-2">
					<p className={"text-2xl font-medium"}>solved {solvedCount}/{entireCount}</p>
					<p className={"text-2xl font-medium"}><span className="text-xl">in</span> {dayjs(usedTime).format("mm:ss:SSS")}</p>
				</div>
			</div>
			<form action={submitAction} className={"flex gap-8 bg-white flex-col"}>
				<label htmlFor="name" className="flex flex-col items-center">
					<p className="text-center text-lg">name</p>
					<Input name={"name"} type="text" maxLength={10} className="rounded-2xl w-1/2 border-none text-2xl bg-[#F5F5F5] shadow-bottom " placeholder="Enter your name" />
				</label>
				{error && <p className="text-red-500 text-center">{error}</p>}
				<button disabled={isPending} className={"bg-[#7BFE7F] py-5 text-3xl mt-auto w-full shadow-bottom"} type="submit">
					CLOSE
				</button>
			</form>
		</div>
	</div >;
};

export default RankFormModal;