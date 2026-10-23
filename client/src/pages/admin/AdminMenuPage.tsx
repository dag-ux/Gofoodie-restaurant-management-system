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

  // ==========================================
  // SKELETON LOADING STATE
  // ==========================================
  if (loading) {
    return (
      <div className="animate-pulse pb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <div className="h-9 bg-stone-200 dark:bg-stone-800 rounded-lg w-64 mb-3"></div>
            <div className="h-5 bg-stone-200 dark:bg-stone-800 rounded-lg w-80"></div>
          </div>
          <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded-xl w-36"></div>
        </div>
        
        <div className="h-28 bg-stone-200 dark:bg-stone-800 rounded-2xl mb-6"></div>
        
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden">
           <div className="h-14 bg-stone-100 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800"></div>
           {[1, 2, 3, 4, 5].map(i => (
             <div key={i} className="flex items-center gap-4 p-4 border-b border-stone-100 dark:border-stone-800/50">
                <div className="w-12 h-12 bg-stone-200 dark:bg-stone-800 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/2"></div>
                </div>
                <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded w-20"></div>
                <div className="h-8 bg-stone-200 dark:bg-stone-800 rounded w-16"></div>
             </div>
           ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 relative">
      
      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`fixed top-8 right-8 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border transition-all duration-300 animate-slide-in ${
          toast.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/90 dark:border-green-800 dark:text-green-300' 
            : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-800 dark:text-red-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span className="font-bold text-sm">{toast.message}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight mb-2">
            Menu <span className="bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="text-stone-500 mt-1 text-sm md:text-base">Manage your restaurant's dishes and categories.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
        >
          <Plus size={18} /> Add New Dish
        </button>
      </div>

      {/* FILTERS & SEARCH (Matching Admin Layout) */}
      <div className="mb-8">
          {/* Search Bar - Sleeker and Compact */}
          <div className="relative w-full max-w-xl mx-auto mb-6">
            <Search className="absolute left-4 top-3 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Search dishes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm transition-all text-sm"
            />
          </div>

          {/* Category Pills - Compact and elegant */}
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => setActiveCategory('All')}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                activeCategory === 'All' 
                  ? 'bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white shadow-md transform scale-105' 
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-gofoodie-orange hover:text-gofoodie-orange'
              }`}
            >
              All Items
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${
                  activeCategory === cat.name 
                    ? 'bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white shadow-md transform scale-105' 
                    : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-gofoodie-orange hover:text-gofoodie-orange'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-stone-50 dark:bg-stone-800/50 text-stone-500 dark:text-stone-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 font-bold">Dish Details</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-stone-200 dark:border-stone-700 shadow-sm" />
                      <div>
                        <p className="font-bold text-stone-900 dark:text-white text-base">{item.name}</p>
                        <p className="text-xs text-stone-500 line-clamp-1 max-w-[200px]">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-bold px-2.5 py-1 rounded-md border border-stone-200 dark:border-stone-700">
                      {item.category?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-gofoodie-orange font-black text-base">{item.price} <span className="text-xs text-stone-400 font-bold">ETB</span></span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(item)} className="p-2 text-stone-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => openDeleteModal(item)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={40} className="text-stone-300 dark:text-stone-700 mb-3" />
                      <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-1">No dishes found</h3>
                      <p className="text-sm text-stone-500">Try changing your search or category filter.</p>
                    </div>
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
            <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up border border-stone-200 dark:border-stone-700">
              <div className="flex justify-between items-center p-5 border-b border-stone-100 dark:border-stone-800 sticky top-0 bg-white/95 dark:bg-stone-900/95 backdrop-blur z-10">
                <h2 className="text-xl font-extrabold text-stone-900 dark:text-white">
                  {modalMode === 'edit' ? 'Edit Dish' : 'Add New Dish'}
                </h2>
                <button onClick={closeModal} className="p-1.5 text-stone-400 hover:text-red-500 bg-stone-100 dark:bg-stone-800 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">Dish Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm transition-all" placeholder="e.g. Doro Wat" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">Price (ETB)</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm transition-all" placeholder="450" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">Category</label>
                    <select required name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm transition-all">
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">Image URL</label>
                  <input required type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm transition-all" placeholder="https://images.unsplash.com/..." />
                  {formData.imageUrl && (
                    <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} onLoad={(e) => (e.currentTarget.style.display = 'block')} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">Description</label>
                  <textarea required rows={3} name="description" value={formData.description} onChange={handleChange} className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-gofoodie-orange bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white text-sm transition-all resize-none" placeholder="Describe the dish..."></textarea>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-end gap-2">
                  <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-xl font-bold text-sm text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-gofoodie-orange to-gofoodie-yellow text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center gap-2 disabled:opacity-50">
                    {isSubmitting ? <><Loader2 className="animate-spin" size={16} /> Saving...</> : 'Save Dish'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* DELETE CONFIRMATION MODAL */}
          {modalMode === 'delete' && selectedItem && (
            <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-slide-up border border-stone-200 dark:border-stone-700">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl font-extrabold text-stone-900 dark:text-white mb-2">Delete Dish?</h2>
              <p className="text-sm text-stone-500 mb-6">
                Are you sure you want to delete <strong className="text-stone-900 dark:text-white">{selectedItem.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button onClick={closeModal} className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-stone-600 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700 transition-colors">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 bg-red-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : 'Yes, Delete'}
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