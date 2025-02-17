import React from 'react'
import Container from '../components/container/Container'
import PostForm from '../components/post-form/PostForm'
import AddPostComponent from '../components/AddPostComponent/AddPostComponent'

const AddPost = () => {
  return (
    <div className='py-6'>
      <Container>
        <AddPostComponent />
      </Container>
    </div>
  )
}

export default AddPost
