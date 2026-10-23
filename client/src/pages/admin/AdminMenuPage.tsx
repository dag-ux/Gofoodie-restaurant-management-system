import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { Trash2, Plus, Edit, X, CheckCircle, AlertCircle, Loader2, Search } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  category: Category;
  imageUrl: string;
}

const AdminMenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filtering & Search State
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageUrl: '',
  });

  // Toast Notification State
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        axiosClient.get('/menu'),
        axiosClient.get('/categories')
      ]);
      setMenuItems(menuRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
      setToast({ type: 'error', message: 'Failed to load menu data.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- MODAL HANDLERS ---
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ 
      name: '', 
      description: '', 
      price: '', 
      categoryId: categories[0]?.id.toString() || '', 
      imageUrl: '' 
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: MenuItem) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      categoryId: item.categoryId.toString(),
      imageUrl: item.imageUrl || '',
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (item: MenuItem) => {
    setModalMode('delete');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // --- CRUD ACTIONS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      categoryId: Number(formData.categoryId)
    };

    try {
      if (modalMode === 'edit' && selectedItem) {
        await axiosClient.put(`/menu/${selectedItem.id}`, payload);
        setToast({ type: 'success', message: 'Dish updated successfully!' });
      } else {
        await axiosClient.post('/menu', payload);
        setToast({ type: 'success', message: 'New dish added successfully!' });
      }
      closeModal();
      fetchData();
    } catch (error) {
      console.error("Failed to save item", error);
      setToast({ type: 'error', message: 'Failed to save the dish. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    setIsSubmitting(true);
    try {
      await axiosClient.delete(`/menu/${selectedItem.id}`);
      setToast({ type: 'success', message: 'Dish deleted successfully!' });
      closeModal();
      fetchData();
    } catch (error) {
      console.error("Failed to delete item", error);
      setToast({ type: 'error', message: 'Failed to delete the dish.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category?.name === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin text-gofoodie-orange mb-4" size={48} />
        <p className="text-stone-500 font-bold animate-pulse">Loading Menu Management...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 relative">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border transition-all duration-300 animate-slide-in ${
          toast.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/90 dark:border-green-800 dark:text-green-300' 
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-red-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">Menu Management</h1>
          <p className="text-stone-500 mt-2">Manage your restaurant's dishes and categories.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-gofoodie-orange text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add New Dish
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 mb-6 flex flex-col lg:flex-row gap-4 justify-between items-center">
        
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
          <button 
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === 'All' ? 'bg-gofoodie-orange text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
          >
            All Items
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === cat.name ? 'bg-gofoodie-orange text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-3 text-stone-400" size={20} />
          <input 
            type="text" 
            placeholder="Search dishes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white transition-all"
          />
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50 dark:bg-stone-800/50 text-stone-500 dark:text-stone-400 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-5 font-bold">Dish Details</th>
                <th className="p-5 font-bold">Category</th>
                <th className="p-5 font-bold">Price</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-stone-200 dark:border-stone-700 shadow-sm" />
                      <div>
                        <p className="font-bold text-stone-900 dark:text-white text-lg">{item.name}</p>
                        <p className="text-sm text-stone-500 line-clamp-1 max-w-[250px]">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold px-3 py-1.5 rounded-lg">
                      {item.category?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="p-5">
                    <span className="text-gofoodie-orange font-extrabold text-lg">{item.price} <span className="text-xs text-stone-500">ETB</span></span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(item)} className="p-2.5 text-stone-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => openDeleteModal(item)} className="p-2.5 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-stone-500 font-medium">
                    No dishes found. Try a different search or category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          
          {/* CREATE/EDIT MODAL */}
          {modalMode !== 'delete' && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-slide-up border border-stone-200 dark:border-stone-700">
              <div className="flex justify-between items-center p-6 border-b border-stone-100 dark:border-stone-800 sticky top-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur z-10">
                <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white">
                  {modalMode === 'edit' ? 'Edit Dish' : 'Add New Dish'}
                </h2>
                <button onClick={closeModal} className="p-2 text-stone-400 hover:text-red-500 bg-stone-100 dark:bg-stone-800 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Dish Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white transition-all" placeholder="e.g. Doro Wat" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Price (ETB)</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white transition-all" placeholder="450" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Category</label>
                    <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white transition-all">
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Image URL</label>
                  <input required type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white transition-all" placeholder="https://images.unsplash.com/..." />
                  {formData.imageUrl && (
                    <div className="mt-3 w-16 h-16 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2">Description</label>
                  <textarea required rows={3} name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white transition-all resize-none" placeholder="Describe the dish..."></textarea>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-3">
                  <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-gofoodie-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50">
                    {isSubmitting ? <><Loader2 className="animate-spin" size={20} /> Saving...</> : 'Save Dish'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* DELETE CONFIRMATION MODAL */}
          {modalMode === 'delete' && selectedItem && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-slide-up border border-stone-200 dark:border-stone-700">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-stone-900 dark:text-white mb-2">Delete Dish?</h2>
              <p className="text-stone-500 mb-8">
                Are you sure you want to delete <strong className="text-stone-900 dark:text-white">{selectedItem.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={closeModal} className="flex-1 px-6 py-3 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Yes, Delete'}
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AdminMenuPage;