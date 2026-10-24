import { useCallback, useEffect, useState } from 'react'

// Puts a reordered subset (say, only the art projects) back into the full list:
// each member takes the slot the previous member of the subset held.
export function mergeSubset(full, subsetNext, isMember) {
  let i = 0
  return full.map((row) => (isMember(row) ? subsetNext[i++] : row))
}

// The load / delete-with-confirmation / editor-open / reorder flow every
// section shares. `update` is only needed by sections that can be reordered.
export function useCrud({ list, remove, update, toast, noun }) {
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

  // The list updates at once, then only the rows whose position changed are
  // written back as display_order 0..n-1.
  const reorder = async (next) => {
    const changed = next.filter((row, i) => row.display_order !== i)
    setItems(next.map((row, i) => ({ ...row, display_order: i })))
    const results = await Promise.all(
      changed.map((row) => update(row.id, { display_order: next.indexOf(row) }))
    )
    const failed = results.find((r) => r.error)
    if (failed) {
      toast(`Couldn't save the new order: ${failed.error.message}`, 'error')
      reload()
    } else {
      toast('Order saved', 'success')
    }
  }

  return {
    items, setItems, loading, reload,
    editor, openEditor, closeEditor,
    toDelete, setToDelete, deleting, confirmDelete,
    reorder,
  }
}
