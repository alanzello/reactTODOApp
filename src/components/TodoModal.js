/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { MdOutlineClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { addTodo, updateTodo } from '../slices/todoSlice';
import styles from '../styles/modules/modal.module.scss';
import Button from './Button';
import { useRef } from 'react';


const dropIn = {
  hidden: {
    opacity: 0,
    transform: 'scale(0.9)',
  },
  visible: {
    transform: 'scale(1)',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    transform: 'scale(0.9)',
    opacity: 0,
  },
};


/**
 *
 * @param {*} param0
 * @returns
 */

function TodoModal({ type, modalOpen, setModalOpen, todo }) {

  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('incomplete');
  const fileInputRef = useRef()
  const [file , setFile] = useState(null)
  const [preview , setPreview] = useState('')
  const [date , setDate] = useState('')


  /**
    return uploaded image
  */
  useEffect(() =>{
    if(file){
      const reader = new FileReader()
      reader.onloadend = () =>{
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }else{
      setPreview(null)
    }
  },[file])

/** updates todo values */

  useEffect(() => {
    if (type === 'update' && todo) {
      setTitle(todo.title);
      setStatus(todo.status);
      setPreview(todo.preview);
      setDate(todo.date);
    } else {
      setTitle('');
      setStatus('incomplete');
      setPreview(null)
      setDate();
    }
  }, [type, todo, modalOpen]);



  const handleSubmit = (e) => {
    e.preventDefault();
    if (title === '') {
      toast.error('Please enter a title');
      return;
    }

/**
 adding entered values into todo
 */
    if (title && status) {
      if (type === 'add') {
        dispatch(
          addTodo({
            id: uuid(),
            title,
            preview,
            status,
            date,
            time: new Date().toLocaleString(),
          })
        );
        toast.success('Task added successfully');
      }
      if (type === 'update') {
        if ( todo.title !== title ||  todo.status !== status ||  todo.file !== file || todo.date !== date) {
          dispatch(updateTodo({ ...todo, title, status , preview , date}));
          toast.success('Task Updated successfully');
        } else {
          toast.error('No changes made');
          return;
        }
      }
      setModalOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.container}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.closeButton}
              onKeyDown={() => setModalOpen(false)}
              onClick={() => setModalOpen(false)}
              role="button"
              tabIndex={0}
              // animation
              initial={{ top: 40, opacity: 0 }}
              animate={{ top: -10, opacity: 1 }}
              exit={{ top: 40, opacity: 0 }}
            >
              <MdOutlineClose />
            </motion.div>

            <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
              <h1 className={styles.formTitle}>
                {type === 'add' ? 'Add' : 'Update'} TODO
              </h1>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <label htmlFor="file">
                File
                <input
                  type="file"
                  id="file"
                  ref={fileInputRef}
                  accept='image/*'
                  onChange={(e) => {
                    const img = e.target.files[0]
                    if(img && img.type.substring(0 ,5) == 'image'){
                      setFile(img)
                    } else {
                      setFile(null)
                    }
                  }}
                />
              </label>
              <label htmlFor="date">
                Date
                <input
                  type="date"
                  id="date"
                  onChange={(e) => {
                    setDate(e.target.value)
                  }}
                />
              </label>
              <label htmlFor="type">
                Status
                <select
                  id="type"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="incomplete">Incomplete</option>
                  <option value="complete">Completed</option>
                </select>
              </label>
              <div className={styles.buttonContainer}>
                <Button type="submit" variant="primary">
                  {type === 'add' ? 'Add Task' : 'Update Task'}
                </Button>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TodoModal;
