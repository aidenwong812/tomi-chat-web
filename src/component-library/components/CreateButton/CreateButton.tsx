const CreateButton = ({
  isCreateChatRoom,
  setIsCreateChatRoom,
}: {
  isCreateChatRoom: boolean;
  setIsCreateChatRoom: (isCreateChatRoom: boolean) => void;
}) => (
  <div className="flex justify-end px-4">
    <button
      type="button"
      className="rounded-full dark:bg-[#111111] hover:bg-[#FF0083] hover:text-white dark:hover:bg-[#FF0083] 
      dark:hover:text-white duration-300 bg-white text-black border border-[#FF0083] dark:text-white p-2 min-w-[100px]"
      onClick={() => setIsCreateChatRoom(!isCreateChatRoom)}>
      {isCreateChatRoom ? "Complete" : "Create"}
    </button>
  </div>
);

export default CreateButton;
