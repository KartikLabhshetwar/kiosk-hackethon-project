import streamlit as st
from recommender import JewelryRecommender
from pathlib import Path

# Page config
st.set_page_config(
    page_title="Evol Jewels AI Kiosk",
    page_icon="💎",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for kiosk-like experience
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
        color: #D4AF37;
        margin-bottom: 2rem;
    }
    .product-card {
        border: 2px solid #D4AF37;
        border-radius: 10px;
        padding: 1.5rem;
        margin: 1rem 0;
        background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
    }
    .price-tag {
        font-size: 1.5rem;
        color: #4CAF50;
        font-weight: bold;
    }
    .stButton>button {
        width: 100%;
        background-color: #D4AF37;
        color: white;
        font-weight: bold;
        padding: 0.75rem;
        font-size: 1.1rem;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if "step" not in st.session_state:
    st.session_state.step = 0
if "preferences" not in st.session_state:
    st.session_state.preferences = {}

@st.cache_resource
def load_recommender():
    """Load recommender (cached for performance)"""
    try:
        return JewelryRecommender()
    except FileNotFoundError as e:
        st.error(f"❌ {str(e)}")
        st.info("💡 Run preprocessing first: `uv run python src/preprocess.py`")
        st.stop()

def main():
    # Header
    st.markdown('<div class="main-header">💎 Evol Jewels AI Stylist</div>', unsafe_allow_html=True)
    
    # Load recommender
    recommender = load_recommender()
    
    # Sidebar - Quick search mode
    st.sidebar.title("🔍 Quick Search")
    quick_query = st.sidebar.text_input("Search jewelry...", placeholder="e.g., elegant gold necklace")
    
    if quick_query:
        results = recommender.search(quick_query, top_k=5)
        display_results(results, recommender)
        return
    
    # Main flow - Guided experience
    st.sidebar.title("🎯 Personal Stylist Mode")
    st.sidebar.write("Let us guide you to the perfect jewelry!")
    
    # Progress indicator
    progress = st.session_state.step / 4
    st.sidebar.progress(progress)
    st.sidebar.write(f"Step {st.session_state.step + 1} of 5")
    
    # Question flow
    if st.session_state.step == 0:
        show_occasion_step(recommender)
    elif st.session_state.step == 1:
        show_budget_step(recommender)
    elif st.session_state.step == 2:
        show_style_step(recommender)
    elif st.session_state.step == 3:
        show_category_step(recommender)
    elif st.session_state.step == 4:
        show_recommendations(recommender)

def show_occasion_step(recommender):
    st.header("🎉 What's the Occasion?")
    
    col1, col2, col3 = st.columns(3)
    
    occasions = [
        ("🎊 Wedding", "wedding"),
        ("💍 Engagement", "engagement"),
        ("🎂 Birthday", "birthday"),
        ("🌟 Anniversary", "anniversary"),
        ("👔 Party", "party"),
        ("💼 Daily Wear", "daily casual")
    ]
    
    for idx, (label, value) in enumerate(occasions):
        col = [col1, col2, col3][idx % 3]
        with col:
            if st.button(label, key=f"occasion_{idx}"):
                st.session_state.preferences["occasion"] = value
                st.session_state.step = 1
                st.rerun()

def show_budget_step(recommender):
    st.header("💰 What's Your Budget?")
    
    col1, col2 = st.columns(2)
    
    with col1:
        budget_range = st.selectbox(
            "Select budget range",
            ["50k - 1L", "1L - 2L", "2L - 5L", "5L - 10L", "10L+", "Custom"]
        )
    
    if budget_range == "Custom":
        with col2:
            custom_budget = st.text_input("Enter budget (e.g., 2L-5L)")
            min_price, max_price = recommender.parse_budget(custom_budget)
    else:
        budget_map = {
            "50k - 1L": (50000, 100000),
            "1L - 2L": (100000, 200000),
            "2L - 5L": (200000, 500000),
            "5L - 10L": (500000, 1000000),
            "10L+": (1000000, None)
        }
        min_price, max_price = budget_map[budget_range]
    
    if st.button("Next →"):
        st.session_state.preferences["min_price"] = min_price
        st.session_state.preferences["max_price"] = max_price
        st.session_state.step = 2
        st.rerun()

def show_style_step(recommender):
    st.header("✨ What's Your Style?")
    
    styles = [
        "Traditional", "Modern", "Minimalist", "Elegant",
        "Vintage", "Contemporary", "Bohemian", "Classic"
    ]
    
    col1, col2, col3, col4 = st.columns(4)
    
    for idx, style in enumerate(styles):
        col = [col1, col2, col3, col4][idx % 4]
        with col:
            if st.button(style, key=f"style_{idx}"):
                st.session_state.preferences["style"] = style.lower()
                st.session_state.step = 3
                st.rerun()

def show_category_step(recommender):
    st.header("💎 Preferred Category?")
    
    categories = recommender.get_categories()
    
    col1, col2, col3 = st.columns(3)
    
    # Option to skip
    if st.button("🚀 Show All Categories (Skip)"):
        st.session_state.preferences["category"] = None
        st.session_state.step = 4
        st.rerun()
    
    st.write("---")
    
    for idx, category in enumerate(categories[:9]):  # Show up to 9
        col = [col1, col2, col3][idx % 3]
        with col:
            if st.button(category, key=f"cat_{idx}"):
                st.session_state.preferences["category"] = category
                st.session_state.step = 4
                st.rerun()

def show_recommendations(recommender):
    st.header("🎁 Your Personalized Recommendations")
    
    prefs = st.session_state.preferences
    
    # Build query
    query_parts = []
    if prefs.get("style"):
        query_parts.append(prefs["style"])
    if prefs.get("occasion"):
        query_parts.append(prefs["occasion"])
    if prefs.get("category"):
        query_parts.append(prefs["category"])
    
    query = " ".join(query_parts) if query_parts else "jewelry"
    
    # Search
    results = recommender.search(
        query=query,
        min_price=prefs.get("min_price"),
        max_price=prefs.get("max_price"),
        category=prefs.get("category"),
        top_k=6
    )
    
    display_results(results, recommender)
    
    # Reset button
    if st.button("🔄 Start Over"):
        st.session_state.step = 0
        st.session_state.preferences = {}
        st.rerun()

def display_results(results, recommender):
    """Display product cards in a grid"""
    
    if not results:
        st.warning("No products found matching your criteria. Try adjusting your preferences.")
        return
    
    st.success(f"Found {len(results)} perfect matches for you!")
    
    # Display in 2-column grid
    for i in range(0, len(results), 2):
        col1, col2 = st.columns(2)
        
        for idx, col in enumerate([col1, col2]):
            if i + idx < len(results):
                product = results[i + idx]
                with col:
                    st.markdown('<div class="product-card">', unsafe_allow_html=True)
                    
                    st.subheader(f"🏆 #{product['rank']}: {product['product_name']}")
                    
                    if product.get("collection"):
                        st.write(f"**Collection:** {product['collection']}")
                    
                    if product.get("category"):
                        st.write(f"**Category:** {product['category']}")
                    
                    if product.get("price"):
                        st.markdown(f'<div class="price-tag">₹{product["price"]:,.0f}</div>', unsafe_allow_html=True)
                    
                    st.write(f"**Match Score:** {product['similarity_score']:.2f}")
                    
                    # Display image if available
                    if product.get("images"):
                        image_path = Path(product["images"])
                        if image_path.exists():
                            st.image(str(image_path), use_column_width=True)
                    
                    # Add product link button
                    if product.get("product_url"):
                        st.markdown(f"""
                        <div style="margin-top: 1rem;">
                            <a href="{product['product_url']}" target="_blank" style="
                                display: inline-block;
                                background-color: #D4AF37;
                                color: white;
                                padding: 0.5rem 1rem;
                                text-decoration: none;
                                border-radius: 5px;
                                font-weight: bold;
                                text-align: center;
                                width: 100%;
                            ">🛍️ View on Evol Jewels</a>
                        </div>
                        """, unsafe_allow_html=True)
                    
                    st.markdown('</div>', unsafe_allow_html=True)

if __name__ == "__main__":
    main()
