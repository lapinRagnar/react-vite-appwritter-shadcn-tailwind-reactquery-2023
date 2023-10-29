import React, {useCallback, useState} from 'react'
import {FileWithPath, useDropzone} from 'react-dropzone'
import { Button } from '../ui/button'


type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void,
  mediaUrl: string
}

const Fileuploader = ({fieldChange, mediaUrl}: FileUploaderProps) => {

  const [file, setFile] = useState<File[]>([])

  const [fileUrl, setFileUrl] = useState('')

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    // Do something with the files
    setFile(acceptedFiles)
    fieldChange(acceptedFiles)
    setFileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])                        // mbola rotaka, il a mis file dans la dependance
  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.svg'],
    }
  })

  return (
    <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer' />
      {
        fileUrl 
        ? (
          <>
          
            <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
              <img 
                src={fileUrl}
                alt='image'
                className='file_uploader-img'
              />
            </div>
            
            <p className='file_uploader-label'>click or drag a photo to replace</p>

          </>
        )
        
        : (
          <div className='file_uploader-box'>
            <img
              src='/assets/icons/file-upload.svg'
              alt='file upload'
              width={95}
              height={95}
            />
            <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photo here</h3>
            <p className='text-light-4 small-regular mb-6'>SVG, PNG, JPEG</p>

            <Button className='shad-button_dark_4'>
              Select from computer
            </Button>
          </div>
        )


      }
    </div>
  )
}

export default Fileuploader