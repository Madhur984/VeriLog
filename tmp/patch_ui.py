
import sys
import os

def patch_file(filepath, search_text, replace_text):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if search_text not in content:
        print(f"FAILED: Search text not found in {filepath}")
        # Try a more relaxed search if possible, or just fail
        return False
    
    new_content = content.replace(search_text, replace_text)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"SUCCESS: Patched {filepath}")
    return True

# 1. Patch SceneCounter.tsx
counter_file = r'c:\Users\soham\OneDrive\Desktop\games\kriten_documents\VeriLog_k1\frontend\src\components\level3\SceneCounter.tsx'
search1 = """                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8
                                    }}"""
replace1 = """                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        position: 'relative'
                                    }}"""

search2 = """                                    <span style={{ 
                                        fontFamily: T.mono, fontSize: 48, fontWeight: 900, 
                                        color: isErrorState ? T.error : (bit ? T.accent : T.muted) 
                                    }}>
                                        {bit}
                                    </span>"""
replace2 = """                                    <span style={{ 
                                        fontFamily: T.mono, fontSize: 48, fontWeight: 900, 
                                        color: isErrorState ? T.error : (bit ? T.accent : T.muted) 
                                    }}>
                                        {bit}
                                    </span>
                                    {/* Engineering Overlay: Carry Logic Link */}
                                    {isLogicOverlayVisible && i < 3 && (
                                        <div style={{ position: 'absolute', right: -24, top: '50%', transform: 'translateY(-50%)', zIndex: 10, display: 'flex', alignItems: 'center' }}>
                                            <motion.div 
                                               animate={{ opacity: hasPulse ? 1 : 0.4, scale: hasPulse ? 1.2 : 1 }}
                                               style={{ width: 14, height: 14, borderRadius: '50%', background: T.warning, border: `1px solid ${T.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <div style={{ width: 4, height: 4, borderRadius: '50%', background: T.bg }} />
                                            </motion.div>
                                            <div style={{ height: 1, width: 12, background: T.warning, opacity: 0.3 }} />
                                        </div>
                                    )}"""

# 2. Patch SceneRegister.tsx
register_file = r'c:\Users\soham\OneDrive\Desktop\games\kriten_documents\VeriLog_k1\frontend\src\components\level3\SceneRegister.tsx'
search3 = """                                    width: 32, height: 40, border: '2px solid', borderRadius: 4,
                                    fontFamily: T.mono, fontSize: 14, fontWeight: 900, cursor: 'pointer',
                                    color: bit ? T.accent : T.muted
                                }}"""
replace3 = """                                    width: 32, height: 40, border: '2px solid', borderRadius: 4,
                                    fontFamily: T.mono, fontSize: 14, fontWeight: 900, cursor: 'pointer',
                                    color: bit ? T.accent : T.muted,
                                    position: 'relative'
                                }}"""

search4 = """                            >
                                {bit}
                            </motion.button>"""
replace4 = """                            >
                                {bit}
                                {isLogicOverlayVisible && (
                                    <span style={{ position: 'absolute', top: -14, left: 0, right: 0, textAlign: 'center', fontSize: 7, color: T.accent, opacity: 0.6 }}>
                                        {Math.pow(2, registerWidth - 1 - i)}
                                    </span>
                                )}
                            </motion.button>"""

# 3. Patch SceneArithmetic.tsx
arith_file = r'c:\Users\soham\OneDrive\Desktop\games\kriten_documents\VeriLog_k1\frontend\src\components\level3\SceneArithmetic.tsx'
search5 = """                                    <span style={{ fontSize: 12, fontWeight: 800, color: T.text, fontFamily: T.mono }}>{step.a} + {step.b}</span>
                                    {isActive && ("""
replace5 = """                                    <span style={{ fontSize: 12, fontWeight: 800, color: T.text, fontFamily: T.mono }}>{step.a} + {step.b}</span>
                                    
                                    {/* Engineering Overlay: gate logic visualization */}
                                    {isLogicOverlayVisible && (
                                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px dashed ${T.border}`, width: '100%', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
                                            <div style={{ fontSize: 7, fontFamily: T.mono, color: T.accent, opacity: 0.7 }}>FULL ADDER GEN</div>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                <div style={{ padding: '2px 4px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 2, fontSize: 6, color: T.muted }}>XOR</div>
                                                <div style={{ padding: '2px 4px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 2, fontSize: 6, color: T.muted }}>AND</div>
                                                <div style={{ padding: '2px 4px', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 2, fontSize: 6, color: T.muted }}>OR</div>
                                            </div>
                                        </div>
                                    )}

                                    {isActive && ("""

# Execute patches
patch_file(counter_file, search1, replace1)
patch_file(counter_file, search2, replace2)
patch_file(register_file, search3, replace3)
patch_file(register_file, search4, replace4)
patch_file(arith_file, search5, replace5)
