// import { useUserContext } from "@/context/AuthContext"
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations"
import { checkIsLiked } from "@/lib/utils"
import { Models } from "appwrite"
import { useState, useEffect } from "react"
import Loader from "./Loader"

type PostStatsProps = {
  post?: Models.Document
  userId: string
}
const PostStats = ({post, userId}: PostStatsProps) => {

  const likesList = post?.likes.map((user: Models.Document) => user.$id)
  const [likes, setLikes] = useState(likesList)
  const [isSaved, setIsSaved] = useState(false)


  const { mutate: likePost } = useLikePost()
  const { mutate: savePost, isPending: isSavingPost } = useSavePost()
  const { mutate: deleteSavedPost, isPending: isDeletingSavedPost } = useDeleteSavedPost()

  const { data : currentUser } = useGetCurrentUser()

  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post?.$id)

  useEffect(() =>{
    // setIsSaved(savedPostRecord ? true : false) // c'est la même chose dessous
    setIsSaved(!!savedPostRecord)
  }, [currentUser, savedPostRecord])

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation()
    let newLikes = [...likes]
    const hasLiked = newLikes.includes(userId)
    
    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId)
    } else {
      newLikes.push(userId)
    }
      
    setLikes(newLikes)
    likePost({postId: post?.$id || '', likesArray: newLikes})
  }


  // A FAIRE : le save ne marche pas
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (savedPostRecord) {
      setIsSaved(false)
      deleteSavedPost(savedPostRecord.$id)
    } else {
      savePost({postId: post?.$id || '', userId})
      setIsSaved(true)
    }

  }


  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">

        <img 
          src={checkIsLiked(likes, userId) ? "/assets/icons/liked-full.svg" : "/assets/icons/liked-empty.svg" }
          alt="like"
          width={30}
          height={30}
          // onClick={(e) => {handleLikePost(e)}}  // c'est la meeme chose que onClick={handleLikePost}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>

      </div>

      <div className="flex gap-2">
        {
          isSavingPost || isDeletingSavedPost
          ? <Loader />
          : <img 
              src={isSaved ? "/assets/icons/save-minus.svg" : "/assets/icons/save-plus.svg"}
              alt="save"
              width={30}
              height={30}
              onClick={handleSavePost}
              className="cursor-pointer"
            />
        }
      </div>
    </div>
  )
}

export default PostStats