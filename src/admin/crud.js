import { useCallback, useEffect, useState } from 'react'

// The load / delete-with-confirmation / editor-open flow every section shares.
export function useCrud({ list, remove, toast, noun }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  // `mounted` keeps the editor in the tree while its panel slides out.
  const [editor, setEditor] = useState({ mounted: false, open: false, row: null })

  const reload = useCallback(async () => {
    const { data, error } = await list()
    if (error) toast(error.message, 'error')
    else setItems(data)
    setLoading(false)
  }, [list, toast])

  useEffect(() => { reload() }, [reload])

  const openEditor = (row = null) => setEditor({ mounted: true, open: true, row })
  const closeEditor = () => setEditor((e) => ({ ...e, open: false }))

  const confirmDelete = async () => {
    setDeleting(true)
    const { error } = await remove(toDelete.id)
    setDeleting(false)
    if (error) return toast(error.message, 'error')
    toast(`${noun} deleted`, 'success')
    setToDelete(null)
    await reload()
  }

  return {
    items, loading, reload,
    editor, openEditor, closeEditor,
    toDelete, setToDelete, deleting, confirmDelete,
  }
}
