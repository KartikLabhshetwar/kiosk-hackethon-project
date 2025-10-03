import streamlit as st
import sys
from pathlib import Path

# Add src to path for imports
sys.path.append(str(Path(__file__).parent))

from recommender import JewelryRecommender
from celebrity_engine import CelebrityInspirationEngine
from vibe_classifier import VibeClassifier

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
def load_engines():
    """Load all AI engines (cached for performance)"""
    try:
        recommender = JewelryRecommender()
        celebrity_engine = CelebrityInspirationEngine()
        vibe_classifier = VibeClassifier()
        return recommender, celebrity_engine, vibe_classifier
    except FileNotFoundError as e:
        st.error(f"❌ {str(e)}")
        st.info("💡 Run preprocessing first: `uv run python src/preprocess.py`")
        st.stop()

def main():
    # Header
    st.markdown('<div class="main-header">💎 Evol Jewels AI Stylist V2</div>', unsafe_allow_html=True)
    
    # Load all engines
    recommender, celebrity_engine, vibe_classifier = load_engines()
    
    # Sidebar - Quick search mode
    st.sidebar.title("🔍 Quick Search")
    quick_query = st.sidebar.text_input("Search jewelry...", placeholder="e.g., elegant gold necklace")
    
    if quick_query:
        results = recommender.search(quick_query, top_k=5)
        display_results(results, recommender)
        return
    
    # Main navigation
    st.sidebar.title("🎯 Navigation")
    page = st.sidebar.selectbox(
        "Choose your experience:",
        ["🌟 Celebrity Inspiration", "🎨 Vibe Explorer", "🎯 Personal Stylist", "📊 System Stats"]
    )
    
    if page == "🌟 Celebrity Inspiration":
        show_celebrity_page(recommender, celebrity_engine)
    elif page == "🎨 Vibe Explorer":
        show_vibe_page(recommender, vibe_classifier)
    elif page == "🎯 Personal Stylist":
        show_personal_stylist_page(recommender, celebrity_engine, vibe_classifier)
    elif page == "📊 System Stats":
        show_stats_page(recommender, celebrity_engine, vibe_classifier)

def show_celebrity_page(recommender, celebrity_engine):
    """Celebrity Inspiration Page"""
    st.header("🌟 Celebrity Inspiration Engine")
    st.write("Get jewelry recommendations inspired by your favorite celebrities!")
    
    # Get all celebrities
    celebrities = celebrity_engine.list_celebrities()
    
    # Display celebrity grid
    cols = st.columns(3)
    for idx, celeb in enumerate(celebrities):
        with cols[idx % 3]:
            display_name = celeb.replace('_', ' ').title()
            if st.button(f"✨ {display_name}", key=f"celeb_{idx}"):
                st.session_state.selected_celebrity = celeb
                st.rerun()
    
    # Show celebrity details and recommendations
    if hasattr(st.session_state, 'selected_celebrity'):
        celeb = st.session_state.selected_celebrity
        celeb_data = celebrity_engine.get_celebrity_recommendations(celeb)
        
        st.markdown("---")
        st.subheader(f"✨ {celeb.replace('_', ' ').title()}'s Style")
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.write(f"**Style Description:** {celeb_data['style_description']}")
            st.write(f"**Vibes:** {', '.join(celeb_data['vibes'])}")
            st.write(f"**Occasions:** {', '.join(celeb_data['occasions'])}")
        
        with col2:
            st.write(f"**Price Range:** ₹{celeb_data['price_range']['min']:,} - ₹{celeb_data['price_range']['max']:,}")
            st.write(f"**Keywords:** {', '.join(celeb_data['keywords'][:5])}")
            st.write(f"**Preferred Categories:** {', '.join(celeb_data['preferred_categories'])}")
        
        # Get recommendations
        st.subheader("🎁 Recommended Jewelry")
        results = recommender.search_by_celebrity(celeb, top_k=6)
        
        if results:
            display_results(results, recommender)
        else:
            st.warning("No jewelry found matching this celebrity's style.")
        
        if st.button("🔄 Choose Different Celebrity"):
            delattr(st.session_state, 'selected_celebrity')
            st.rerun()

def show_vibe_page(recommender, vibe_classifier):
    """Vibe Explorer Page"""
    st.header("🎨 Vibe Explorer")
    st.write("Explore jewelry by style vibes and discover your perfect match!")
    
    # Get all vibes
    vibes = vibe_classifier.get_all_vibes()
    
    # Vibe emojis
    vibe_emojis = {
        "royal": "👑", "traditional": "🏛️", "modern": "✨", "elegant": "💎",
        "bohemian": "🌺", "vintage": "📜", "glamorous": "⭐", "minimalist": "○",
        "statement": "💥", "festive": "🎉", "romantic": "💕", "professional": "💼",
        "casual": "👕", "luxury": "💎", "artistic": "🎨"
    }
    
    # Display vibe grid
    cols = st.columns(4)
    for idx, vibe in enumerate(vibes):
        with cols[idx % 4]:
            emoji = vibe_emojis.get(vibe, "💎")
            if st.button(f"{emoji} {vibe.title()}", key=f"vibe_{idx}"):
                st.session_state.selected_vibe = vibe
                st.rerun()
    
    # Show vibe details and recommendations
    if hasattr(st.session_state, 'selected_vibe'):
        vibe = st.session_state.selected_vibe
        emoji = vibe_emojis.get(vibe, "💎")
        
        st.markdown("---")
        st.subheader(f"{emoji} {vibe.title()} Style")
        
        # Get vibe keywords
        keywords = vibe_classifier.get_vibe_keywords(vibe)
        st.write(f"**Keywords:** {', '.join(keywords[:10])}")
        
        # Get recommendations
        st.subheader("🎁 Jewelry in This Vibe")
        results = recommender.search_by_vibe(vibe, top_k=6)
        
        if results:
            display_results(results, recommender)
        else:
            st.warning(f"No jewelry found with '{vibe}' vibe.")
        
        if st.button("🔄 Choose Different Vibe"):
            delattr(st.session_state, 'selected_vibe')
            st.rerun()

def show_personal_stylist_page(recommender, celebrity_engine, vibe_classifier):
    """Personal Stylist Page - Original guided flow"""
    st.header("🎯 Personal Stylist Mode")
    st.write("Let us guide you to the perfect jewelry!")
    
    # Progress indicator
    progress = st.session_state.step / 4
    st.progress(progress)
    st.write(f"Step {st.session_state.step + 1} of 5")
    
    # Question flow
    if st.session_state.step == 0:
        show_occasion_step(recommender)
    elif st.session_state.step == 1:
        show_budget_step(recommender)
    elif st.session_state.step == 2:
        show_vibe_step(vibe_classifier)
    elif st.session_state.step == 3:
        show_category_step(recommender)
    elif st.session_state.step == 4:
        show_recommendations(recommender)

def show_stats_page(recommender, celebrity_engine, vibe_classifier):
    """System Statistics Page"""
    st.header("📊 System Statistics")
    
    # Get basic stats
    products_count = len(recommender.metadata)
    celebrities_count = len(celebrity_engine.list_celebrities())
    vibes_count = len(vibe_classifier.get_all_vibes())
    
    # Display stats in columns
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric("Products Loaded", products_count)
    
    with col2:
        st.metric("Celebrities Available", celebrities_count)
    
    with col3:
        st.metric("Vibes Available", vibes_count)
    
    # Vibe distribution
    st.subheader("🎨 Vibe Distribution")
    vibe_stats = recommender.get_vibe_statistics()
    
    if vibe_stats:
        # Create a bar chart
        import pandas as pd
        df = pd.DataFrame(list(vibe_stats.items()), columns=['Vibe', 'Count'])
        st.bar_chart(df.set_index('Vibe'))
        
        # Show detailed stats
        st.write("**Detailed Vibe Statistics:**")
        for vibe, count in vibe_stats.items():
            percentage = (count / products_count) * 100
            st.write(f"- **{vibe.title()}**: {count} products ({percentage:.1f}%)")
    else:
        st.warning("No vibe statistics available.")
    
    # Price range
    st.subheader("💰 Price Range")
    prices = [item["price"] for item in recommender.metadata if item.get("price") is not None]
    
    if prices:
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Min Price", f"₹{min(prices):,}")
        
        with col2:
            st.metric("Max Price", f"₹{max(prices):,}")
        
        with col3:
            st.metric("Avg Price", f"₹{sum(prices)/len(prices):,.0f}")
        
        with col4:
            st.metric("Total Products", len(prices))
    
    # Categories
    st.subheader("💎 Categories")
    categories = recommender.get_categories()
    st.write(f"**Available Categories:** {', '.join(categories)}")
    
    # Collections
    st.subheader("🏛️ Collections")
    collections = recommender.get_collections()
    st.write(f"**Available Collections:** {', '.join(collections[:10])}")  # Show first 10

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

def show_vibe_step(vibe_classifier):
    """Vibe selection step for personal stylist"""
    st.header("💫 What Vibe Are You Looking For?")
    
    vibes = vibe_classifier.get_all_vibes()
    
    # Vibe emojis
    vibe_emojis = {
        "royal": "👑", "traditional": "🏛️", "modern": "✨", "elegant": "💎",
        "bohemian": "🌺", "vintage": "📜", "glamorous": "⭐", "minimalist": "○",
        "statement": "💥", "festive": "🎉", "romantic": "💕", "professional": "💼",
        "casual": "👕", "luxury": "💎", "artistic": "🎨"
    }
    
    cols = st.columns(4)
    for idx, vibe in enumerate(vibes):
        with cols[idx % 4]:
            emoji = vibe_emojis.get(vibe, "💎")
            if st.button(f"{emoji} {vibe.title()}", key=f"vibe_{idx}"):
                st.session_state.preferences["vibe"] = vibe
                st.session_state.step = 3
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
    if prefs.get("vibe"):
        query_parts.append(prefs["vibe"])
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
    """Display product cards in a grid with enhanced information"""
    
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
                    
                    # Display vibes
                    if product.get("vibes"):
                        vibe_emojis = {
                            "royal": "👑", "traditional": "🏛️", "modern": "✨", "elegant": "💎",
                            "bohemian": "🌺", "vintage": "📜", "glamorous": "⭐", "minimalist": "○",
                            "statement": "💥", "festive": "🎉", "romantic": "💕", "professional": "💼",
                            "casual": "👕", "luxury": "💎", "artistic": "🎨"
                        }
                        vibe_display = []
                        for vibe in product["vibes"][:3]:  # Show top 3 vibes
                            emoji = vibe_emojis.get(vibe, "💎")
                            vibe_display.append(f"{emoji} {vibe.title()}")
                        st.write(f"**Vibes:** {', '.join(vibe_display)}")
                    
                    if product.get("price"):
                        st.markdown(f'<div class="price-tag">₹{product["price"]:,.0f}</div>', unsafe_allow_html=True)
                    
                    if product.get("similarity_score"):
                        st.write(f"**Match Score:** {product['similarity_score']:.2f}")
                    
                    # Display celebrity inspiration if available
                    if product.get("celebrity_inspiration"):
                        celeb_info = product["celebrity_inspiration"]
                        st.write(f"**✨ Inspired by:** {celeb_info['celebrity'].replace('_', ' ').title()}")
                        st.write(f"*{celeb_info['style_description']}*")
                    
                    # Display image if available
                    if product.get("images"):
                        image_path = Path(product["images"])
                        if image_path.exists():
                            st.image(str(image_path), use_column_width=True)
                    
                    # Add product link button (only if URL is available and valid)
                    product_url = product.get("product_url")
                    if product_url and product_url.startswith("http") and "evoljewels.com" in product_url:
                        st.markdown(f"""
                        <div style="margin-top: 1rem;">
                            <a href="{product_url}" target="_blank" style="
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
                    # No button shown for products without valid URLs (like Elite Necklace)
                    
                    st.markdown('</div>', unsafe_allow_html=True)

if __name__ == "__main__":
    main()
